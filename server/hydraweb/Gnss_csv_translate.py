import csv
import json
import twd97
from geojson import Feature, Point, FeatureCollection
import os
import pymongo
from datetime import datetime
def GnsscsvToJson(username):
    
    cmd="find /root/platform_gnss_csv/{}/ -name '*.csv'".format(str(username))
    result=os.popen(cmd).read()
    file=[]
    temp=""
    for i in range(0,len(result)):
        if result[i]!="\n":
            temp=temp+str(result[i])
        else:
            file.append(temp)
            temp=""
    csv1=[]
    gnss_csv=[]
    for i in range(0,len(file)):
        temp=file[i].replace("/root/platform_gnss_csv/{}/".format(str(username)),"")
        csv1.append(temp)
    for i in range(0,len(csv1)):
        word_temp=""
        for y in range(0,len(csv1[i])):
            if(csv1[i][y])!='.':
                word_temp=word_temp+csv1[i][y]
            else:
                break
        gnss_csv.append(word_temp)
    
    for i in range(0,len(csv1)):
        jsonArray = []
        temp1=[]
        total=[]

        #read csv file
        with open('/root/platform_gnss_csv/{}/{}'.format(str(username),csv1[i]), newline='') as csvfile:
            csvReader = csv.DictReader(csvfile) 
        
            #convert each csv row into python dict
            for row in csvReader: 
                #add this python dict to json array
                temp=list(row)
                jsonArray.append(row)
        geojson = {
            'type': 'FeatureCollection',
            'features': []
        }
        for record in jsonArray:
            temp1, temp2 = float(record["Lat(度)"]), float(record['Lon(度)'])
            my_point = Point((float(temp2), float(temp1)))
            geojson['features'].append({
                'type': 'Feature',
                'geometry': my_point,
                'properties': record,
            })   
        with open('/root/platform_gnss_csv/{}/{}.json'.format(str(username),gnss_csv[i]), 'w', encoding='utf-8') as jsonf: 
            jsonString = json.dumps(geojson, ensure_ascii=False,indent=4)
            jsonf.write(jsonString)
    json_file=[]

    entries = os.listdir("/root/platform_gnss_csv/{}/".format(str(username)))

    for i in range (0,len(entries)):
        temp=""
        for y in range (len(entries[i])-5,len(entries[i])):
            temp=temp+entries[i][y]
        if temp=='.json':
            json_file.append(entries[i])
    print(json_file)
    temp=str(username)
    word_temp=""
    for i in range(0,len(temp)):
        if temp[i]!='.':
            word_temp=word_temp+temp[i]
        else:
            word_temp=word_temp+'_'
    username1=word_temp
    db_name = '{}_GNSS'.format(str(username1))
    client = pymongo.MongoClient('mongodb://localhost:27017')
    db = client[db_name]
    dir_path="/root/GNSS_Search_Data/csv_to_json/"
    for i in range(0,len(json_file)):
        name=json_file[i]
        #print(name)
        name=name.replace(".json","")
        col = db['{}'.format(name)]
        cur = col.find()
        results = list(cur)
        if len(results)!=0:
            col.delete_many({})
        read_path = '/root/platform_gnss_csv/{}/{}.json'.format(str(username),str(name))
        with open(read_path,"r",encoding="utf-8") as jsonfile:
            data = json.load(jsonfile)
            timeless_dict = {}
            for dt in data['features']:
                date_arr = []
                coord = dt["geometry"]["coordinates"]
                geo = dt["geometry"]["type"]
                timeless_dict["x"] = coord[0]
                timeless_dict["y"] = coord[1]
                timeless_dict["geometry"] = geo
                timeless_dict["time_series"] = True
                #print(timeless_dict)
                for tag in dt["properties"]:
                    if tag!="Time":
                        timeless_dict[tag] = dt["properties"][tag]
                    else:
                        temp2=datetime.strptime(dt["properties"][tag], '%Y-%m-%dT%H:%M:%SZ')
                        temp3=datetime.strftime(temp2, '%Y-%m-%dT%H:%M:%SZ')
                        
                        date_arr.append({"time": temp3})
                for d in date_arr:
                    results = {**timeless_dict, **d}
                    #print(results)
                    col.insert_one(results)
        map_path="/var/www/html/app-deploy/HydraWeb/server/map_data"
        map_path = os.path.join(map_path,"{}").format(str(db_name))
        if os.path.exists(map_path)!=True:
            os.mkdir(map_path, 777)
        os.system('cp {} {}'.format(str(read_path),str(map_path)))