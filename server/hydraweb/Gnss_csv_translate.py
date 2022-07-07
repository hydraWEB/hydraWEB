import csv
import json
import twd97
from geojson import Feature, Point, FeatureCollection
import os
import pymongo
def GnsscsvToJson():
    
    cmd="find /root/GNSS_Search_Data/CRD_TO_CSV/ -name '*.csv' -mmin -20"
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
        temp=file[i].replace("/root/GNSS_Search_Data/CRD_TO_CSV/","")
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
        with open('/root/GNSS_Search_Data/CRD_TO_CSV/{}'.format(csv1[i]), newline='') as csvfile:
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
        with open('/root/GNSS_Search_Data/csv_to_json/{}.json'.format(gnss_csv[i]), 'w', encoding='utf-8') as jsonf: 
            jsonString = json.dumps(geojson, ensure_ascii=False,indent=4)
            jsonf.write(jsonString)
    json_file=[]

    entries = os.listdir('/root/GNSS_Search_Data/csv_to_json/')

    for i in range (0,len(entries)):
        temp=""
        for y in range (len(entries[i])-5,len(entries[i])):
            temp=temp+entries[i][y]
        if temp=='.json':
            json_file.append(entries[i])
    db_name = 'GNSS_station'
    client = pymongo.MongoClient('mongodb://localhost:27017')
    db = client[db_name]
    dir_path="/root/GNSS_Search_Data/csv_to_json/"
    for i in range(0,len(json_file)):
        read_path = os.path.join(dir_path,"{}").format(str(json_file[i]))
        fname = json_file[i].replace(".json", "")
        col = db["{}".format(str(fname))]
        cur = col.find()
        results = list(cur)
        if len(results)!=0:
            col.delete_many({})
        with open(read_path,"r",encoding="utf-8") as jsonfile:
            data = json.load(jsonfile)
            for dt in data['features']:
                results={}
                if str(dt["geometry"]["coordinates"][0])!='' and str(dt["geometry"]["coordinates"][0])!='':
                    results["x"] = dt["geometry"]["coordinates"][0]
                    results["y"] = dt["geometry"]["coordinates"][1]
                    results['time_series'] = 'false'
                    results["geometry"] = dt["geometry"]["type"]
                    prop = dt["properties"]
                    results.update(prop)
                    col.insert_one(results)
        map_path="/var/www/html/app-deploy/HydraWeb/server/map_data"
        map_path = os.path.join(map_path,"{}").format(str(db_name))
        if os.path.exists(map_path)!=True:
            os.mkdir(map_path, 777)
        os.system('cp {} {}'.format(str(read_path),str(map_path)))