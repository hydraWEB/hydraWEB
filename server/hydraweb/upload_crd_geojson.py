import os
from itertools import islice
import copy
import string 
import csv
import math
import numpy
from datetime import datetime
import twd97
from geojson import Feature, Point, FeatureCollection
import pymongo
import json
def decdeg2dms(dd):
    is_positive = dd >= 0
    dd = abs(dd)
    minutes,seconds = divmod(dd*3600,60)
    degrees,minutes = divmod(minutes,60)
    degrees = degrees if is_positive else -degrees
    
    d = round(degrees, 0)
    m = round(minutes, 0)
    s = round(seconds, 5)
    d = int(d)
    d = str(d)
    m = int(m)
    m = str(m)
    s = str(s)
    dms=d+m+s
    
    return dms
def XYZTOGEODETIC(x,y,z):
    a = 6378137.0 #in meters
    b = 6356752.314245 #in meters

    f = (a - b) / a
    f_inv = 1.0 / f

    e_sq = f * (2 - f)                       
    eps = e_sq / (1.0 - e_sq)

    p = math.sqrt(x * x + y * y)
    q = math.atan2((z * a), (p * b))

    sin_q = math.sin(q)
    cos_q = math.cos(q)

    sin_q_3 = sin_q * sin_q * sin_q
    cos_q_3 = cos_q * cos_q * cos_q

    phi = math.atan2((z + eps * b * sin_q_3), (p - e_sq * a * cos_q_3))
    lam = math.atan2(y, x)

    v = a / math.sqrt(1.0 - e_sq * math.sin(phi) * math.sin(phi))
    high = (p / math.cos(phi)) - v

    latitude = math.degrees(phi)
    longitude= math.degrees(lam)
        
    # 取到小數點後四位
    
    lat = round(latitude, 8)
    lon = round(longitude,8)
    h   = round(high, 4)
    h = str(h)
    
    #需要將經緯度從 DD(十進位) 轉換為 DMS(度分秒) 
    #lat = decdeg2dms(lat)
    #lon = decdeg2dms(lon)
    
    return lat, lon, h
def UploadCRDToJson(username, fileName, read_dir, write_dir):
    file=[]
    file_name=[]
    read_dir_path = os.path.join(read_dir, fileName+'.CRD')
    csv_write_path = "/var/www/html/app-deploy/HydraWeb/server/platform_upload_gnss_csv/"
    csv_write_path = csv_write_path+str(username)
    write_dir_path = os.path.join(write_dir, fileName+'.json')
    if os.path.isdir(csv_write_path)==False:
        os.mkdir(csv_write_path)
    
    with open(read_dir_path,'r')as f:
        rows = f.readlines()
        sum=0
        header=["NUM","STATION","NAME","Lat(度)","Lon(度)","h(m)","FLAG","Time"]
        with open(csv_write_path+'/'+fileName+'.csv','w')as out:
            writer = csv.writer(out)
            writer.writerow(header)
            for row in islice(rows, 6, None): #從第一筆資料(6)開始
                list1 =[]
                s=""
                
                # txt 尾段有空白行，靠此來 break 掉
                if(len(row)==1):
                    print("end of file")
                    break

                #將每筆資料的值存到 list 內
                for i in row:
                    if(i != ' ' and i != '\n'):
                        s+=i
                    if(i ==' '):
                        list1.append(s)
                        s=""
                list1.append(s) # z 後面沒有空格，所以需要額外 append 到 list 內
                
                list1 = [x.strip() for x in list1 if x.strip()!=''] #清掉 list 的空值
                
                # 檔案內有兩行含 PPP 數值，避免干擾換算，先 pop 掉
                        
                try:
                    float(list1[-1])
                    list1.append("")
                except:
                    a=1
                
                # 增加空格，讓輸入函式的 x,y,z 可以在 list 的位置是固定的
                if(len(list1)<7):
                    list1.insert(2,'')
                # string 轉 float 
                x=float(list1[3])
                y=float(list1[4])
                z=float(list1[5])
                    
            
                # 轉換完的 x,y,z 取代 list 3後面的值
                list1[3:6] = XYZTOGEODETIC(x,y,z)
                list1[3:6] = XYZTOGEODETIC(x,y,z)
                if list1[-1]==str("PPP"):
                    for row in islice(rows, 2, None): # 抓時間段
                        # 刪除\n
                        row = row[:-1]
            
                        #日期轉換 2021-01-01 11:59:45 to 2021-01-01T11:59:45Z
                        row = row.replace("LOCAL GEODETIC DATUM: IGS14             EPOCH: ","")
                        t=row
                        temp1 = datetime.strptime(t, "%Y-%m-%d %H:%M:%S")
                        temp2 = datetime.strftime(temp1, '%Y-%m-%dT%H:%M:%SZ')
                        list1.append(temp2)
                        break
                    writer.writerow(list1)
                sum+=1
            
                #print("list = ",list1)
            #print("總筆數 = ",sum)
    for i in range(0,1):
        jsonArray = []
        temp1=[]
        total=[]

        #read csv file
        with open(csv_write_path+'/'+fileName+'.csv','r', newline='') as csvfile:
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
        with open(write_dir_path, 'w', encoding='utf-8') as jsonf: 
            jsonString = json.dumps(geojson, ensure_ascii=False,indent=4)
            jsonf.write(jsonString)
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
    for i in range(0,1):
        name=fileName
        #print(name)
        col = db['{}'.format(name)]
        cur = col.find()
        results = list(cur)
        if len(results)!=0:
            col.delete_many({})
        with open(write_dir_path,"r",encoding="utf-8") as jsonfile:
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
        os.system('cp {} {}'.format(str(write_dir_path),str(map_path)))