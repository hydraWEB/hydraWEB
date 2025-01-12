import collections
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
# Create your views here.
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
from rest_framework import viewsets, status
from rest_framework import views
import os, io, zipfile
import pymongo
import json
import base64
import fitz
import csv
import re
from PIL import Image
import datetime
import sys
from staff.models import SystemLog,SystemOperationEnum
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from django.http import FileResponse, HttpRequest, HttpResponse, JsonResponse
from rest_framework.parsers import FileUploadParser, JSONParser, MultiPartParser
from datetime import datetime
from django.core.files.storage import FileSystemStorage
from geojson import Feature, Point, FeatureCollection, LineString, Polygon
sys.path.append(os.path.abspath("/var/www/html/app-deploy/HydraWeb/server/hydraweb"))
from geojson_to_shapefile import GeojsonToShp
from geojson_to_shapefile_gpd import GeojsonToShp2
from shp_change_geojson import ShpToGeojson
from record_upload_file import RecordUploadFile
from csv_to_geojson import csvTOGeojson
from insert_mogno import insertjsonToMongo
from xlsx_to_geojson import xlsxTOGeojson
from GNSS_crd_translate import GnsscrdToCsv
from Gnss_csv_translate import GnsscsvToJson
from upload_crd_geojson import UploadCRDToJson
from checkChoushi_editLine import CheckChoushi
import time
import pandas as pd
import twd97
import pprint
import pymysql
'''
class LayerAPIView(views.APIView):      #資料夾

    def get(self,request):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        all_dir = os.listdir(f"{dir_path}/data")
        result = []
        for dir in all_dir:
            is_time_series = False
            json_list = os.listdir(f"{dir_path}/data/{dir}")
            res_json = []
            for js in json_list:
                f = open(f'{dir_path}/data/{dir}/{js}',"r",encoding="utf8")
                if js.startswith("time_series_"):
                    is_time_series = True
                else :
                    is_time_series = False
                json_data = json.load(f)
                res_json.append({"name":f"{js}","data":json_data,"time_serie":is_time_series})
            result.append({"name":f"{dir}","file":res_json})

        SystemLog.objects.create_log(user=request.user,operation=SystemOperationEnum.USER_READ_HYDRAWEB_LAYER)
        return Response({"status":"created","data":result}, status=status.HTTP_200_OK)   
'''
class LayerListAPIView(views.APIView):      #INFLUX + MONGO 傳到LayerV2.jsx
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"
    token = os.environ.get('INFLUX_TOKEN')
    org = os.environ.get('INFLUX_ORG')
    
    def post(self,request):
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client[os.environ.get('MONGODB_DB')]
        databases = client.list_database_names()    #get all database from mongodb
        start=time.time()
        #remove unwanted database
        db = pymysql.connect(
            host='localhost',
            port=3306,
            charset='utf8',
            user=os.environ.get('DB_USER'),
            passwd=os.environ.get('DB_PASS'),
            db=os.environ.get('DB_NAME')
        )
        
        cursor = db.cursor()
        sql = "select email from authentication_user"
        cursor.execute(sql)
        result=cursor.fetchall()
        user=[]
        for i in range(0,len(result)):
            if result[i][0].find(str(request.user))<0:
                user.append(result[i][0])
        print(user)
        user1=[]
        for i in range(0,len(user)):
            temp=user[i]
            word_temp=""
            for y in range(0,len(temp)):
                if temp[y]!='.':
                    word_temp=word_temp+temp[y]
                else:
                    word_temp=word_temp+'_'
            user1.append(word_temp)
        print(user1)
        databases.remove("admin")              
        databases.remove("config")
        databases.remove("local")
        databases.remove("ps")      #file too large, cause rendering slow
        databases.remove("ps_part")
        databases.remove("ST_NO")
        databases.remove("tags")
        databases.remove("user_data")
        databases.remove("users_space")
        resultDatabases = []
        for dt in databases:
            temp=""
            temp=str(dt)
            counter=0
            if temp.find("part")<0:
                for i in range(0,len(user1)):
                    
                    if temp.find(str(user1[i]))>=0:
                        counter=1
                        break
                if counter==0:
                    print(dt)
                    resultDatabases.append(dt)
        SystemLog.objects.create_log(user=request.user,operation=SystemOperationEnum.USER_READ_HYDRAWEB_LAYER)
        end = time.time()
        end = end-start
        end = round(end,4)
        print(end)
        #print(total_prop)
        #resultarr.append({"name":"Upload", "file":self.query_file()})
        return Response({"status":"created","data":resultDatabases}, status=status.HTTP_200_OK)   
    
class Choushui_editLineLayerListAPIView(views.APIView):  #只傳送在choushui_editLine裡的圖層資料  傳到LayerV2.jsx
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    
    def post(self,request):
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client[os.environ.get('MONGODB_DB')]
        databases = client.list_database_names()    #get all database from mongodb
        start=time.time()
        #remove unwanted database
        db = pymysql.connect(
            host='localhost',
            port=3306,
            charset='utf8',
            user=os.environ.get('DB_USER'),
            passwd=os.environ.get('DB_PASS'),
            db=os.environ.get('DB_NAME')
        )
        
        cursor = db.cursor()
        sql = "select email from authentication_user"
        cursor.execute(sql)
        result=cursor.fetchall()
        user=[]
        for i in range(0,len(result)):
            if result[i][0].find(str(request.user))<0:
                user.append(result[i][0])
        print(user)
        user1=[]
        for i in range(0,len(user)):
            temp=user[i]
            word_temp=""
            for y in range(0,len(temp)):
                if temp[y]!='.':
                    word_temp=word_temp+temp[y]
                else:
                    word_temp=word_temp+'_'
            user1.append(word_temp)
        databases.remove("admin")              
        databases.remove("config")
        databases.remove("local")
        databases.remove("ps_part")      #file too large, cause rendering slow
        databases.remove("ps")
        databases.remove("ST_NO")
        databases.remove("tags")
        databases.remove("user_data")
        databases.remove("users_space")
        resultDatabases = []
        for dt in databases:
            temp=""
            temp=str(dt)
            counter=0
            if temp.find("part")>0:
                for i in range(0,len(user1)):
                    tempDB = dt.replace("_part", "")
                    if tempDB.find(str(user1[i]))>=0:
                        counter=1
                        break
                if counter==0:
                    tempDB = dt.replace("_part", "")
                    resultDatabases.append(tempDB)
        SystemLog.objects.create_log(user=request.user,operation=SystemOperationEnum.USER_READ_HYDRAWEB_LAYER)
        end = time.time()
        end = end-start
        end = round(end,4)
        print(end)
        return Response({"status":"created","data":resultDatabases}, status=status.HTTP_200_OK)   
    
class PartLayerListAPIView(views.APIView):  #只回傳被選擇的資料庫 傳到LayerV2.jsx
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"
    token = os.environ.get('INFLUX_TOKEN')
    org = os.environ.get('INFLUX_ORG')
    
    def post(self, request):
        client = pymongo.MongoClient('mongodb://localhost:27017')
        start=time.time()
        resultarr = []
        new_json = {}
        total_prop = []
        dbs = request.data["database"]
        if(len(dbs) == 0):
            SystemLog.objects.create_log(user=request.user,operation=SystemOperationEnum.USER_READ_HYDRAWEB_LAYER)
            return Response({"status":"created","data":[]}, status=status.HTTP_200_OK)
        else:
            for db in dbs:
                tempDB = client[db]     #connect to the database
                tempCollection = tempDB.list_collection_names()
                is_time_series = False
                res_json = []
                if(db == "ps_part" or db == "ps"):
                    collection = tempDB.get_collection("ps")
                    result = collection.find()
                    features = []
                    tags = []
                    for dt in result:
                        inside_json = {
                            "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [dt['x'], dt['y']]
                                },
                            "properties": dt['z']
                        }
                        features.append(inside_json)
                    new_json = {
                            "type": "FeatureCollection",
                            "features": features
                    }
                    res_json.append({"name": "ps", "data": new_json,"time_serie":is_time_series,"tag":tags})
                else:
                    for col in tempCollection:
                        tags = []
                        collection = tempDB.get_collection(col)
                        result = collection.find()
                        features = []
                        is_time_series = False
                        for dt in result:
                            if str(dt['geometry'])==str('Point'):
                                coordinates = [dt['x'],dt['y']]
                                try:
                                    if(dt['time_series'] == True):
                                        is_time_series = True
                                except:
                                    is_time_series = False

                                properties = {}
                            
                                for d in dt:
                                    try:
                                        tags = dt["tag"]
                                    except:
                                        pass
                                    if(d != "_id" and d != 'x' and d!= 'y' and d!= 'tags'): 
                                        properties[d] = dt[d]
                                    if(d.find("prop")==0): #這部分在確認
                                        if len(total_prop)==0:
                                            total_prop.append(str(db))
                                        else:
                                            counter=0
                                            for i in range(0,len(total_prop)):
                                                if str(total_prop[i])==str(db):
                                                    counter=0
                                                    break
                                                else:
                                                    counter=1
                                            if counter==1:
                                                total_prop.append(str(db)) 
                                inside_json = {
                                    "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": coordinates
                                        },
                                    "properties": properties
                                }
                                features.append(inside_json)
                            elif str(dt['geometry'])==str('MultiPoint'):
                                coordinates = dt["coordinates"]
                                try:
                                    if(dt['time_series'] == True):
                                        is_time_series = True
                                except:
                                    is_time_series = False
                                properties = {}
                            
                                for d in dt:
                                    try:
                                        tags = dt["tag"]
                                    except:
                                        pass
                                    if(d != "_id" and d != 'coordinates' and d!= 'geometry' and d!= 'tags'): 
                                        properties[d] = dt[d]
                                inside_json = {
                                    "type": "Feature",
                                        "geometry": {
                                            "type": "MultiPoint",
                                            "coordinates": coordinates
                                        },
                                    "properties": properties
                                }
                                
                                features.append(inside_json)
                            elif str(dt['geometry'])==str('Polygon'):
                                coordinates = dt["coordinates"]
                                try:
                                    if(dt['time_series'] == True):
                                        is_time_series = True
                                except:
                                    is_time_series = False
                                properties = {}
                            
                                for d in dt:
                                    try:
                                        tags = dt["tag"]
                                    except:
                                        pass
                                    if(d != "_id" and d != 'coordinates' and d!= 'geometry' and d!= 'tags'): 
                                        properties[d] = dt[d]
                                inside_json = {
                                    "type": "Feature",
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [coordinates]
                                        },
                                    "properties": properties
                                }
                                
                                features.append(inside_json)
                            elif str(dt['geometry'])==str('MultiPolygon'):
                                coordinates = dt["coordinates"]
                                try:
                                    if(dt['time_series'] == True):
                                        is_time_series = True
                                except:
                                    is_time_series = False
                                properties = {}
                            
                                for d in dt:
                                    try:
                                        tags = dt["tag"]
                                    except:
                                        pass
                                    if(d != "_id" and d != 'coordinates' and d!= 'geometry' and d!= 'tags'): 
                                        properties[d] = dt[d]
                                inside_json = {
                                    "type": "Feature",
                                        "geometry": {
                                            "type": "MultiPolygon",
                                            "coordinates": coordinates
                                        },
                                    "properties": properties
                                }
                                
                                features.append(inside_json)
                            elif str(dt['geometry'])==str('LineString'):
                                coordinates = dt["coordinates"]
                                try:
                                    if(dt['time_series'] == True):
                                        is_time_series = True
                                except:
                                    is_time_series = False
                                properties = {}
                            
                                for d in dt:
                                    try:
                                        tags = dt["tag"]
                                    except:
                                        pass
                                    if(d != "_id" and d != 'coordinates' and d!= 'geometry' and d!= 'tags'): 
                                        properties[d] = dt[d]
                                inside_json = {
                                    "type": "Feature",
                                        "geometry": {
                                            "type": "LineString",
                                            "coordinates": coordinates
                                        },
                                    "properties": properties
                                }
                                features.append(inside_json)
                            elif str(dt['geometry'])==str('MultiLineString'):
                                coordinates = dt["coordinates"]
                                try:
                                    if(dt['time_series'] == True):
                                        is_time_series = True
                                except:
                                    is_time_series = False
                                properties = {}
                            
                                for d in dt:
                                    try:
                                        tags = dt["tag"]
                                    except:
                                        pass
                                    if(d != "_id" and d != 'coordinates' and d!= 'geometry' and d!= 'tags'): 
                                        properties[d] = dt[d]
                                inside_json = {
                                    "type": "Feature",
                                        "geometry": {
                                            "type": "MultiLineString",
                                            "coordinates": coordinates
                                        },
                                    "properties": properties
                                }
                                features.append(inside_json)
                        new_json = {
                            "type": "FeatureCollection",
                            "features": features
                        }
                        
                        res_json.append({"name": col, "data": new_json,"time_serie":is_time_series,"tag":tags})
                database_name = db.replace("_part", "")
                resultarr.append({"name": database_name, "file":res_json})
        SystemLog.objects.create_log(user=request.user,operation=SystemOperationEnum.USER_READ_HYDRAWEB_LAYER)
        end = time.time()
        end = end-start
        end = round(end,4)
        print(end)
        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)   
    
class WaterLevelAllStationAPI(views.APIView): #抓Mongodb 的 ST_NO databases 傳到WaterLevelV2.jsx
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"

    def get_all_station(self,collection):   #從mongo拿所有的站點資料
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client['ST_NO']        #get database name ST_NO
        allCollection = db.list_collection_names()
        resultArr = []
        full_data_arr = []
        pumping_changhua_arr = []
        pumping_yunlin_arr = []
        for col in allCollection:
            if(col == 'full_data' or col == 'Pumping_Changhua' or col == 'Pumping_Yunlin'):
                collection = db.get_collection(col)
                arr = []
                result = collection.find()
                for dt in result:
                    dict_result = {}
                    temp = []
                    temp.append(dt["ST_NO"])
                    temp.append(dt["NAME_C"])
                    temp.append(dt["min_time"])
                    temp.append(dt["max_time"])
                    dict_result = {"name":col, "data":temp}
                    arr.append(dict_result)
                if(col == "full_data"):
                    full_data_arr = arr
                elif(col == "Pumping_Changhua"):
                    pumping_changhua_arr = arr
                elif(col == "Pumping_Yunlin"):
                    pumping_yunlin_arr = arr
        newfulldatalist = sorted(full_data_arr, key=lambda d: d['data'][0])
        newchanghualist = sorted(pumping_changhua_arr, key=lambda d: d['data'][0])
        newyunlinlist = sorted(pumping_yunlin_arr, key=lambda d: d['data'][0])
        return [newfulldatalist,newyunlinlist,newchanghualist]

    def get(self,request):
        resultarr = self.get_all_station("ST_NO")
        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)  
    
    
class PDFAndPngAPI(views.APIView): #傳到BackendImage.jsx
    
    def get(self,request):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        all_dir = os.listdir(f"{dir_path}/imgdata/")
        pdf_dir = os.listdir(f"{dir_path}/pdf/")
        result = []
        """ for data in pdf_dir:                #get all img inside pdf
            path = os.path.join(dir_path,"pdf",data)
            doc = fitz.open(path)
            for i in range(len(doc)):
                for img in doc.getPageImageList(i):
                    xref = img[0]
                    pix = fitz.Pixmap(doc, xref)
                    if pix.n < 5:       # this is GRAY or RGB
                        pix.writePNG(path+"p%s-%s.png" % (i, xref))
                    else:               # CMYK: convert to RGB first
                        pix1 = fitz.Pixmap(fitz.csRGB, pix)
                        pix1.writePNG(path+"p%s-%s.png" % (i, xref))
                        pix1 = None
                    pix = None """
        for data in all_dir:                #convert image to base64
            path = os.path.join(dir_path,"imgdata",data)
            if(data.endswith(".png")):
                with open(path,"rb") as image_file:
                    base64string = base64.b64encode(image_file.read())
                    result.append(base64string)
                
                
        return Response({"status":"created","data":result}, status=status.HTTP_200_OK)
"""             img = open(path, 'rb')
            result.append(img)
        response = FileResponse(img)
        return response
        for img in all_dir:
            path = os.path.join(dir_path+"/imgdata/",img)
            print(path)
            with open("server\hydraweb\imgdata\Screenshot 2021-08-09 193834.png", "rb") as f:
                return Response({"status":"created","data":f}, status=status.HTTP_200_OK)   """

        #SystemLog.objects.create_log(user=request.user,operation=SystemOperationEnum.USER_READ_HYDRAWEB_LAYER)
        #return Response({"status":"created","data":result}, status=status.HTTP_200_OK)   


class AllTagsAPI(views.APIView):        #從mongodb拿tags資料for 環域分析所有圖標 傳到CircleAnalysis.jsx
            
    def getAllTags(self):
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client[os.environ.get('MONGODB_TAGS_DB')]
        col = db.get_collection(os.environ.get('MONGODB_TAGS_COL'))    
        result = col.find()
        allTags = []
        for dt in result:
            for tag in dt['tag']:
                allTags.append(tag)
        finalArr = []
        for i in set(allTags):
            finalArr.append(i)
        return finalArr
    
    def post(self,request):
        resultarr = self.getAllTags()
        print(resultarr)
        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)  
    
class TagsAPI(views.APIView): #抓哪個圖層的單個圖標,例如彰化,雲林,time_series 傳到CircleAnalysis.jsx
    
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    
    def findGISbyTag(self):
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client[os.environ.get('MONGODB_TAGS_DB')]
        col = db.get_collection(os.environ.get('MONGODB_TAGS_COL'))  
        result = col.find()  
        resultGIS = []
        for dt in result:
            tempArr = []
            tempArr.append(dt['name'])
            tempArr.append(dt['tag'])
            resultGIS.append(tempArr)
        return resultGIS
    
    def get(self,request):     #從influx拿該站點資料
        resultArr = self.findGISbyTag()      #要改
        return Response({"status":"created","data":resultArr}, status=status.HTTP_200_OK)  


class WaterLevelDownloadAPI(views.APIView): #單純下載時序性資料for influxdb  傳到WaterLevelV2.jsx
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"
    token = os.environ.get('INFLUX_TOKEN')
    org = os.environ.get('INFLUX_ORG')
    
    
    def post(self,request):     #從influx拿該站點資料
        print(request.data)
        st_no = request.data['st_no']
        time_series = request.data['time_series']
        start_time = request.data['start_time']
        end_time = request.data['end_time']
        
        avg_day = request.data['avg_day']
        avg_hour = request.data['avg_hour']
        avg_minute = request.data['avg_minute']
        
        res = self.get_target_station_data_and_download(st_no,start_time,end_time,avg_day,avg_hour,avg_minute,time_series)       #要改
        return res 
        
    def get_target_station_data_and_download(self, st_no, start_time, end_time, avg_day, avg_hour, avg_minute, time_series):
        switch_bucket_dict = {
            "水位": "full_data",
            "雲林抽水": "pumping_station_yunlin",
            "彰化抽水": "pumping_station_changhua"
        }
        start=time.time()
        print("WaterLevelDownloadAPI")
        client = influxdb_client.InfluxDBClient(
            url=self.url,
            token=self.token,
            org=self.org,
            timeout=None
        )
        query_api = client.query_api()
        if int(avg_day) == 0 and int(avg_hour) == 0 and int(avg_minute) == 0:
            #|> range(start: 1970-01-01T00:00:00Z)\
            if switch_bucket_dict[time_series]=="full_data":
                influxdb_csv_result = query_api.query_csv(f'from (bucket:"{switch_bucket_dict[time_series]}")\
                |> range(start: {start_time}, stop: {end_time})\
                |> filter(fn: (r) => r["ST_NO"] == "{st_no}")\
                |> filter(fn: (r) => r._field == "Water_Level")')
            elif switch_bucket_dict[time_series]=="pumping_station_yunlin" or switch_bucket_dict[time_series]=="pumping_station_changhua":
                influxdb_csv_result = query_api.query_csv(f'from (bucket:"{switch_bucket_dict[time_series]}")\
                |> range(start: {start_time}, stop: {end_time})\
                |> filter(fn: (r) => r._measurement == "{st_no}")\
                |> filter(fn: (r) => r._field == "pump" and r["_value"] > -9998)')
        elif int(avg_day) != 0 or int(avg_hour) != 0 or int(avg_minute) != 0:
            avg_day=int(avg_day)*3600
            avg_hour=int(avg_hour)*60
            temp=0
            temp=temp+int(avg_day)
            temp=temp+int(avg_hour)
            temp=temp+int(avg_minute)
            p = {
                 "_every": datetime.timedelta(minutes=temp)
             }
            if switch_bucket_dict[time_series]=="full_data":
                influxdb_csv_result = query_api.query_csv(f'from (bucket:"{switch_bucket_dict[time_series]}")\
                |> range(start: {start_time}, stop: {end_time})\
                |> filter(fn: (r) => r["ST_NO"] == "{st_no}")\
                |> filter(fn: (r) => r._field == "Water_Level")\
                |> timedMovingAverage(every: _every,period: _every)',params=p)
            elif switch_bucket_dict[time_series]=="pumping_station_yunlin" or switch_bucket_dict[time_series]=="pumping_station_changhua":
                influxdb_csv_result = query_api.query_csv(f'from (bucket:"{switch_bucket_dict[time_series]}")\
                |> range(start: {start_time}, stop: {end_time})\
                |> filter(fn: (r) => r._measurement == "{st_no}")\
                |> filter(fn: (r) => r._field == "pump" and r["_value"] > -9998)')
        #開始打開.csv的檔案
        response = HttpResponse(
            content_type='text/csv',
        )
        count = 0
        writer = csv.writer(response)
        to_copy_idx = []
        content = []
        if switch_bucket_dict[time_series]=="full_data":
            print(0)
            for row in influxdb_csv_result:
                count += 1 #只取第四項之後的欄位值
                if count == 4:
                    for i,x in enumerate(row):
                        if(x == "_time" or x == "_value" or x == "NAME_C" or x =="ST_NO"):
                            to_copy_idx.append(i)
                            content.append(x)
                    writer.writerow(content)
                    break
        elif switch_bucket_dict[time_series]=="pumping_station_yunlin" or switch_bucket_dict[time_series]=="pumping_station_changhua":
            print(1)
            for row in influxdb_csv_result:
                count += 1
                if count == 4:
                    for i,x in enumerate(row):
                        if(x == "_time" or x == "_value" or x == "LON" or x =="LAT" or x =="W_TUBE_DEP" or x =="pumping_station"):
                            to_copy_idx.append(i)
                            content.append(x)
                    writer.writerow(content)       
                    break
        for row in influxdb_csv_result:
            count += 1
            content = []
            #print(row)
            if count > 4:
                for i,x in enumerate(row):
                    if(i in to_copy_idx):
                        content.append(x)
            writer.writerow(content)
        end = time.time()
        end = end-start
        end = round(end,4)
        print("download time:{}".format(end))
        return response
        
class UploadFileAPI(views.APIView): #傳到Upload.jsx
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    parser_classes = (MultiPartParser,)
    
    def Record_File(self, username, filename, dir_path, counter): #check ok
        RecordUploadFile(username, filename, dir_path, counter)
    def insert_Mongo(self, username, filename, dir_path): #check ok
        insertjsonToMongo(username, filename, dir_path)
    def checkChoushi_editLine(self, username):
        CheckChoushi(username)
    def post(self,request):     #only upload
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        dir_path_temp = os.path.join(dir_path, "{}").format(request.user)
        if os.path.isdir(dir_path_temp)==False:
            os.mkdir(dir_path_temp)
        dir_path = dir_path_temp
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        if(request):
            for f in file:
                counter=0
                filename = os.path.join(dir_path, f.name)
                if os.path.isfile(filename)==True:
                    os.remove(filename)
                    counter=1
                #---------------create a temp edit to remove boundary------------
                if(f.name.endswith('.json')):
                    temp_filename = "temp.json"
                elif(f.name.endswith('.csv')):
                    temp_filename = "temp.csv"
                elif(f.name.endswith('.xlsx')):
                    temp_filename = "temp.xlsx"
                elif(f.name.endswith('.shp')):
                    temp_filename = "temp.shp"
                elif(f.name.endswith('.shx')):
                    temp_filename = "temp.shx"
                elif(f.name.endswith('.dbf')):
                    temp_filename = "temp.dbf"
                elif(f.name.endswith('.CRD')):
                    temp_filename = "temp.CRD"
                elif(f.name.endswith('.prj')):
                    temp_filename = "temp.prj"
                if(temp_filename == "temp.shp" or temp_filename == "temp.shx" or temp_filename == "temp.dbf" or temp_filename == "temp.prj" or temp_filename == "temp.xlsx" or temp_filename == "temp.CRD"):
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(f.name, f)
                elif(temp_filename != ""):
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(temp_filename, f)
                #---------------create a temp edit to remove boundary------------
                    if temp_filename != "temp.shp" or temp_filename != "temp.shx" or temp_filename != "temp.dbf" or temp_filename != "temp.prj" or temp_filename != "temp.xlsx" or temp_filename != "temp.CRD":
                        encode="utf-8"
                        with open(os.path.join(dir_path, temp_filename), "r", encoding='utf-8') as read:
                            try:
                                readline = read.readlines()
                            except:
                                encode="big5"
                                read.close()
                        with open(os.path.join(dir_path, temp_filename), "r", encoding='{}'.format(str(encode))) as read:   #read the temp file
                            with open(filename, 'w', encoding='utf8') as writefile:                       #create newfile is not exist
                                readline = read.readlines()
                                for line in readline:
                                    if not (line.startswith("------") or line.startswith("Content-") or line.startswith("bKit")):     #write everything except boundary
                                        writefile.write(line)
                                writefile.close()
                            read.close()
                    os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file
                
                self.Record_File(request.user, f.name, dir_path, counter)
                check_is_geojson=0
                if(f.name.endswith('.json')):
                    check_is_geojson=0
                    with open (filename, 'r', encoding='utf8') as jsonfile:
                        data=json.load(jsonfile)
                        if 'geometry' in data['features'][0].keys():
                            check_is_geojson=1
                        else:
                            check_is_geojson=0
                if check_is_geojson==1:
                    self.insert_Mongo(request.user, f.name, dir_path)
                    self.checkChoushi_editLine(request.user)
            return Response({"message":"File is recieved", "data":[]}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
         
class UploadAndConvertToCSVFileAPI(views.APIView): # json  and geojson convert to csv #傳到Upload.jsx
    parser_classes = (MultiPartParser,)
    
    def Record_File(self, username, filename, dir_path, counter):
        RecordUploadFile(username, filename, dir_path, counter)
    
    def jsonTocsv(self, fileName, read_dir, write_dir):
        read_dir_path = os.path.join(read_dir, fileName+'.json')
        write_dir_path = os.path.join(write_dir, fileName+'.csv')
        df = pd.read_json(read_dir_path)
        df.to_csv(write_dir_path, index = None)
        
    def geojsonTocsv(self, fileName, read_dir, write_dir): # check ok
        read_dir_path = os.path.join(read_dir, fileName+'.json')
        write_dir_path = os.path.join(write_dir, fileName+'.csv')
        with open (read_dir_path, 'r', encoding='utf8') as jsonfile:
            data=json.load(jsonfile)
            header = ['wgs84(x)','wgs84(y)']
            temp=list(data['features'][0]['properties'])
            for i in range(0,len(temp)):
                header.append(temp[i])
            with open(write_dir_path, 'w',encoding="utf8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow(header)
                for i in range(0,len(data['features'])):
                    csv_temp=[]
                    lon = data['features'][i]['geometry']['coordinates'][0]
                    lat = data['features'][i]['geometry']['coordinates'][1]
                    csv_temp.append(lon)
                    csv_temp.append(lat)
                    for y in range(0,len(temp)):
                        prop_data=data['features'][i]['properties']['{}'.format(temp[y])]
                        csv_temp.append(prop_data)
                    writer.writerow(csv_temp)
    def insert_Mongo(self, username, filename, dir_path): #check ok
        insertjsonToMongo(username, filename, dir_path)
    def checkChoushi_editLine(self, username):
        CheckChoushi(username)
    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        dir_path_temp = os.path.join(dir_path, "{}").format(request.user)
        if os.path.isdir(dir_path_temp)==False:
            os.mkdir(dir_path_temp)
        dir_path = dir_path_temp
        all_dir = os.listdir(dir_path)
        
        temp_filename = ""
        converted_filename = []
        if(request):
            for f in file:
                counter=0
                filename = os.path.join(dir_path, f.name)
                if os.path.isfile(filename)==True:
                    os.remove(filename)
                    counter=1
                #---------------create a temp edit to remove boundary------------
                temp_filename = "temp.json"
                converted_filename.append(f.name.replace("json", "csv")) 
                if(temp_filename != ""):
                    filename = os.path.join(dir_path, f.name)
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(temp_filename, f)
                #---------------create a temp edit to remove boundary------------
                    encode="utf-8"
                    with open(os.path.join(dir_path, temp_filename), "r", encoding='utf-8') as read:
                        try:
                            readline = read.readlines()
                        except:
                            encode="big5"
                            read.close()
                    with open(os.path.join(dir_path, temp_filename), "r", encoding='{}'.format(str(encode))) as read:   #read the temp file
                        with open(filename, 'w', encoding='utf8') as writefile:                       #create newfile is not exist
                            readline = read.readlines()
                            for line in readline:
                                if not (line.startswith("------") or line.startswith("Content-") or line.startswith("bKit")):     #write everything except boundary
                                    writefile.write(line)
                            writefile.close()
                        read.close()
                self.Record_File(request.user, f.name, dir_path, counter)
                check_is_geojson=0
                with open (filename, 'r', encoding='utf8') as jsonfile:
                    data=json.load(jsonfile)
                    if 'geometry' in data['features'][0].keys():
                        check_is_geojson=1
                    else:
                        check_is_geojson=0
                os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file
                if check_is_geojson==0:
                    fname = f.name.replace(".json", "")
                    self.jsonTocsv(fname, dir_path, dir_path)
                    counter=0
                    if os.path.isfile(fname+".csv")==True:
                        os.remove(filename)
                        counter=1
                    self.Record_File(request.user, fname+".csv", dir_path, counter) 
                else:
                    self.insert_Mongo(request.user, f.name, dir_path)
                    self.checkChoushi_editLine(request.user)
                    fname = f.name.replace(".json", "")
                    self.geojsonTocsv(fname, dir_path, dir_path)
                    counter=0
                    if os.path.isfile(fname+".csv")==True:
                        os.remove(filename)
                        counter=1
                    self.Record_File(request.user, fname+".csv", dir_path, counter)
            return Response({"message":"File is recieved", "data":converted_filename}, status=status.HTTP_200_OK)
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadAndConvertToJSONFileAPI(views.APIView): # xlsx and csv convert to json #傳到Upload.jsx
    parser_classes = (MultiPartParser,)
    
    def Record_File(self, username, filename, dir_path, counter):
        RecordUploadFile(username, filename, dir_path, counter)
        
    def csvTojson(self, fileName, read_dir, write_dir): # check ok
        read_dir_path = os.path.join(read_dir, fileName+'.csv')
        write_dir_path = os.path.join(write_dir, fileName+'.json')
        with open(read_dir_path, newline='', encoding="utf8") as csvfile:
            jsonArray=[]
            csvReader = csv.DictReader(csvfile) 
            for row in csvReader:
                #add this python dict to json array
                jsonArray.append(row)
            with open(write_dir_path, 'w',encoding="utf-8") as jsonfile:
                jsonString = json.dumps(jsonArray, ensure_ascii=False,indent=4)
                jsonfile.write(jsonString)
    def xlsxTojson(self, fileName, read_dir, write_dir): # check ok
        read_dir_path = os.path.join(read_dir, fileName+'.xlsx')
        write_dir_path = os.path.join(write_dir, fileName+'.json')
        df = pd.read_excel(read_dir_path)
        temp=list(df)
        record={}
        total=[]
        for i in range(0,len(df)):
            for y in range(0,len(temp)):
                record["{}".format(str(temp[y]))]=str(df["{}".format(temp[y])][i])
            total.append(record)
        with open(write_dir_path, 'w',encoding="utf-8") as jsonfile:
            jsonString = json.dumps(total, ensure_ascii=False,indent=4)
            jsonfile.write(jsonString)
        
    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        dir_path_temp = os.path.join(dir_path, "{}").format(request.user)
        if os.path.isdir(dir_path_temp)==False:
            os.mkdir(dir_path_temp)
        dir_path = dir_path_temp
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        converted_filename = [] 
        if(request):
            for f in file:
                counter=0
                filename = os.path.join(dir_path, f.name)
                if os.path.isfile(filename)==True:
                    os.remove(filename)
                    counter=1
                #---------------create a temp edit to remove boundary------------
                if(f.name.endswith('.csv')):
                    temp_filename = "temp.csv"
                    converted_filename.append(f.name.replace("csv", "json"))
                elif(f.name.endswith('.xlsx')):
                    temp_filename = "temp.xlsx"
                if(temp_filename == "temp.xlsx"):
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(f.name, f)
                elif(temp_filename != ""):
                    filename = os.path.join(dir_path, f.name)
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(temp_filename, f)
                #---------------create a temp edit to remove boundary------------
                    if temp_filename != "temp.xlsx":
                        encode="utf-8"
                        with open(os.path.join(dir_path, temp_filename), "r", encoding='utf-8') as read:
                            try:
                                readline = read.readlines()
                            except:
                                encode="big5"
                                read.close()
                        with open(os.path.join(dir_path, temp_filename), "r", encoding='{}'.format(str(encode))) as read:   #read the temp file
                            with open(filename, 'w', encoding='utf8') as writefile:                       #create newfile is not exist
                                readline = read.readlines()
                                for line in readline:
                                    if not (line.startswith("------") or line.startswith("Content-") or line.startswith("bKit")):     #write everything except boundary
                                        writefile.write(line)
                                writefile.close()
                            read.close()
                    os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file 
                self.Record_File(request.user, f.name, dir_path, counter) 
                if temp_filename != "temp.xlsx":
                    fname = f.name.replace(".csv", "")
                    self.csvTojson(fname, dir_path, dir_path)
                    counter=0
                    if os.path.isfile(fname+".json")==True:
                        os.remove(filename)
                        counter=1
                else:
                    fname = f.name.replace(".xlsx", "")
                    self.xlsxTojson(fname, dir_path, dir_path)
                    counter=0
                    if os.path.isfile(fname+".json")==True:
                        os.remove(filename)
                        counter=1
                self.Record_File(request.user, fname+".json", dir_path, counter)
            return Response({"message":"File is recieved", "data":converted_filename}, status=status.HTTP_200_OK)  
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
                            
class UploadAndConvertToGEOJSONFileAPI(views.APIView): # csv CRD, and shapefile convert to geojson #傳到Upload.jsx
    parser_classes = (MultiPartParser,)
    def Record_File(self, username, filename, dir_path, counter): #check ok
        RecordUploadFile(username, filename, dir_path, counter)
        
    def Shp_geojson(self, fileName, read_dir, write_dir):
        ShpToGeojson(fileName, read_dir, write_dir)  
    def csvTogeojson(self, fileName, read_dir, write_dir): #check ok
        csvTOGeojson(fileName, read_dir, write_dir)
    def xlsxTogeojson(self, fileName, read_dir, write_dir): #check ok.
        xlsxTOGeojson(fileName, read_dir, write_dir)
    def UploadcrdTojson(self, username, fileName, read_dir, write_dir):
        UploadCRDToJson(username, fileName, read_dir, write_dir)
    def insert_Mongo(self, username, filename, dir_path): #check ok
        insertjsonToMongo(username, filename, dir_path)
    def checkChoushi_editLine(self, username):
        CheckChoushi(username)   
    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        dir_path_temp = os.path.join(dir_path, "{}").format(request.user)
        if os.path.isdir(dir_path_temp)==False:
            os.mkdir(dir_path_temp)
        dir_path = dir_path_temp
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        converted_filename = []
        check_shp=0
        shp_name=""
        if(request):
            for f in file:
                counter=0
                filename = os.path.join(dir_path, f.name)
                if os.path.isfile(filename)==True:
                    os.remove(filename)
                    counter=1
                 
                #---------------create a temp edit to remove boundary------------
                if(f.name.endswith('.csv')):
                    temp_filename = "temp.csv"
                    converted_filename.append(f.name.replace(".csv", ".json"))
                elif(f.name.endswith('.xlsx')):
                    temp_filename = "temp.xlsx"
                elif(f.name.endswith('.shp')):
                    temp_filename = "temp.shp"
                    check_shp=1
                    shp_name=f.name
                    converted_filename.append(f.name.replace(".shp", ".json"))
                elif(f.name.endswith('.shx')):
                    temp_filename = "temp.shx"
                elif(f.name.endswith('.dbf')):
                    temp_filename = "temp.dbf"
                elif(f.name.endswith('.prj')):
                    temp_filename = "temp.prj"
                elif(f.name.endswith('.CRD')):
                    temp_filename = "temp.CRD"
                if(temp_filename == "temp.shp" or temp_filename == "temp.shx" or temp_filename == "temp.dbf" or temp_filename == "temp.prj" or temp_filename == "temp.xlsx" or temp_filename == "temp.CRD"):
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(f.name, f)
                elif(temp_filename != ""):
                    filename = os.path.join(dir_path, f.name)
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(temp_filename, f)
                #---------------create a temp edit to remove boundary------------
                    if temp_filename == "temp.shp" or temp_filename == "temp.shx" or temp_filename == "temp.dbf" or temp_filename == "temp.prj" or temp_filename == "temp.xlsx":
                        encode="utf-8"
                        with open(os.path.join(dir_path, temp_filename), "r", encoding='utf-8') as read:
                            try:
                                readline = read.readlines()
                            except:
                                encode="big5"
                                read.close()
                        with open(os.path.join(dir_path, temp_filename), "r", encoding='{}'.format(str(encode))) as read:   #read the temp file
                            with open(filename, 'w', encoding='utf8') as writefile:                       #create newfile is not exist
                                readline = read.readlines()
                                for line in readline:
                                    if not (line.startswith("------") or line.startswith("Content-") or line.startswith("bKit")):     #write everything except boundary
                                        writefile.write(line)
                                writefile.close()
                            read.close()
                    os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file       
                self.Record_File(request.user, f.name, dir_path, counter)
                if(f.name.endswith('.csv')):
                    fname = f.name.replace(".csv", "")
                    self.csvTogeojson(fname, dir_path, dir_path)
                    self.Record_File(request.user, fname+'.json', dir_path, counter)
                    self.insert_Mongo(request.user, fname+'.json', dir_path)
                    self.checkChoushi_editLine(request.user)
                elif(f.name.endswith('.xlsx')):
                    fname = f.name.replace(".xlsx", "")
                    self.xlsxTogeojson(fname, dir_path, dir_path)
                    self.Record_File(request.user, fname+'.json', dir_path, counter)
                    self.insert_Mongo(request.user, fname+'.json', dir_path)
                    self.checkChoushi_editLine(request.user)
                elif(f.name.endswith('.CRD')):
                    fname = f.name.replace(".CRD", "")
                    self.UploadcrdTojson(request.user, fname, dir_path, dir_path)
                    self.Record_File(request.user, fname+'.json', dir_path, counter)
                    temp=str(request.user)
                    temp=temp+"_GNSS"
                    self.checkChoushi_editLine(temp)
            if check_shp==1:
                fname = shp_name.replace(".shp", "")
                self.Shp_geojson(shp_name, dir_path, dir_path)
                self.Record_File(request.user, fname+'.json', dir_path, counter) 
                self.insert_Mongo(request.user, fname+'.json', dir_path)
                self.checkChoushi_editLine(request.user)
            return Response({"message":"File is recieved", "data":converted_filename}, status=status.HTTP_200_OK)
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadAndConvertToSHPFileAPI(views.APIView): # json convert to shapefile #傳到Upload.jsx
    parser_classes = (MultiPartParser,)
    
    def Record_File(self, username, filename, dir_path, counter):
        RecordUploadFile(username, filename, dir_path, counter)
    def insert_Mongo(self, username, filename, dir_path): #check ok
        insertjsonToMongo(username, filename, dir_path)
    def geojsonToSHP(self, fileName, read_dir, write_dir): #check ok
        GeojsonToShp2(fileName,read_dir,write_dir)
    def checkChoushi_editLine(self, username):
        CheckChoushi(username)           
    def post(self,request):
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        dir_path_temp = os.path.join(dir_path, "{}").format(request.user)
        if os.path.isdir(dir_path_temp)==False:
            os.mkdir(dir_path_temp)
        dir_path = dir_path_temp
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        converted_filename = "" 
        if(request):
            for f in file:
                counter=0
                filename = os.path.join(dir_path, f.name)
                if os.path.isfile(filename)==True:
                    os.remove(filename)
                    counter=1 
                #---------------create a temp edit to remove boundary------------
                if(f.name.endswith('.json')):
                    temp_filename = "temp.json"
                if(temp_filename != ""):
                    filename = os.path.join(dir_path, f.name)
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(temp_filename, f)
                #---------------create a temp edit to remove boundary------------
                    encode="utf-8"
                    with open(os.path.join(dir_path, temp_filename), "r", encoding='utf-8') as read:
                        try:
                            readline = read.readlines()
                        except:
                            encode="big5"
                            read.close()
                    with open(os.path.join(dir_path, temp_filename), "r", encoding='{}'.format(str(encode))) as read:   #read the temp file
                        with open(filename, 'w', encoding='utf8') as writefile:                       #create newfile is not exist
                            readline = read.readlines()
                            for line in readline:
                                if not (line.startswith("------") or line.startswith("Content-") or line.startswith("bKit")):     #write everything except boundary
                                    writefile.write(line)
                            writefile.close()
                        read.close()
                os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file
                self.Record_File(request.user, f.name, dir_path, counter)
                self.insert_Mongo(request.user, f.name, dir_path)
                fname = f.name.replace(".json", "")
                self.geojsonToSHP(fname, dir_path, dir_path)
                self.Record_File(request.user, fname+".shp", dir_path, counter)
                self.Record_File(request.user, fname+".shx", dir_path, counter)
                self.Record_File(request.user, fname+".dbf", dir_path, counter)
                self.checkChoushi_editLine(request.user)
            return Response({"message":"File is recieved", "data":converted_filename}, status=status.HTTP_200_OK)
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
                   
class DownloadFileListAPI(views.APIView): #傳到Upload.jsx
    
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    
    def findAllFile(self):
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        dir_path_temp = os.path.join(dir_path, "{}").format(request.user)
        dir_path = dir_path_temp
        all_dir = os.listdir(dir_path)
        fileName = []
        for file in all_dir:
            fileName.append(file)
        return fileName
    
    def post(self,request):     #從資料夾拿文件名稱
        resultArr = self.findAllFile()      
        return Response({"status":"created","data":resultArr}, status=status.HTTP_200_OK)  

class DownloadFileListAPI(views.APIView): #傳到Upload.jsx
    
    renderer_classes = (JSONRenderer,)       
    
    def post(self,request):     #從資料夾拿文件名稱
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        record_file_dir = os.path.join(dir_path,"file_record.csv")
        file_path = []
        file_name = []
        resultArr = []
        op = open(record_file_dir, 'r')
        dt = csv.DictReader(op)
        username = request.user
        print(str(username))
        for r in dt:
            if not (r['file_name'].endswith('shx') or r['file_name'].endswith('dbf') or r['file_name'].endswith('prj')):
                temp = []
                if(r['username'] == str(username)):
                    temp.append(r['file_name'])
                    temp.append(r['download_count'])
                    resultArr.append(temp)
        
        return Response({"status":"created","data":resultArr}, status=status.HTTP_200_OK)  


class DownloadFileAPI(views.APIView):       #下載被選中的檔案 #傳到Upload.jsx
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    
    def zipFile(self, filepath, filename):
        print("hi")
        dir_path = os.path.join(filepath, filename)
        conf=[".shp",".dbf",".shx",".prj",".cpg"]
        filenames=[]
        for i in range(0,len(conf)):
            temp = dir_path
            temp = temp + str(conf[i])
            filenames.append(temp)
        
        with zipfile.ZipFile(os.path.join(filepath,filename+'.zip'), mode ='w') as archive:
            for fname in filenames:
                archive.write(fname, os.path.basename(fname))
        response = os.path.join(filepath,filename+".zip")
        #os.remove(os.path.join(filepath,filename+".zip"))
        #resp = HttpResponse(response, content_type = "application/x-zip-compressed", status=status.HTTP_200_OK)
        return response         
    
    def updateDownloadFile(self, filename):
        header=['file_path','file_name','username','last_download','last_created','download_count']
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        file_dir = os.path.join(dir_path,"file_record.csv")
        op = open(file_dir, 'r')
        dt = csv.DictReader(op)
        up_dt = []
        for r in dt:
            if(r['file_name'] == filename): #download count +1 if found the file name
                row = {'file_path' : r['file_path'],
                   'file_name': r['file_name'],
                   'username': r['username'],
                   'last_download': datetime.date(datetime.now()),
                   'last_created': r['last_created'],
                   'download_count': int(r['download_count'])+1
                }
                up_dt.append(row)
            else:
                row = {'file_path' : r['file_path'],
                   'file_name': r['file_name'],
                   'username': r['username'],
                   'last_download': r['last_download'],
                   'last_created': r['last_created'],
                   'download_count': r['download_count']
                }
                up_dt.append(row)
        op.close()
        op = open("file_record.csv","w", newline='')
        data =csv.DictWriter(op, delimiter=',', fieldnames=header)
        data.writerow(dict((heads, heads) for heads in header))
        data.writerows(up_dt)
        op.close()
        
    def getContentType(self, filename):
        ctDict = {
            "json" : "application/json",
            "csv" : "text/csv",
            "shp" : "application/octet-stream",
            "shx" : "x-gis/x-shapefile",
            "dbf" : "application/octet-stream",
            "zip" : "application/x-zip-compressed",
            "xlsx" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "crd" : "application/crd"
        }
        if(filename.endswith("json")): return ctDict['json']
        elif(filename.endswith("csv")): return ctDict['csv']
        elif(filename.endswith("shp")): return ctDict['shp']
        elif(filename.endswith("shx")): return ctDict['shx']
        elif(filename.endswith("dbf")): return ctDict['dbf']
        elif(filename.endswith("xlsx")): return ctDict['xlsx']
        elif(filename.endswith("crd")): return ctDict['crd']
        
    def post(self,request):     
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        dir_path_temp = os.path.join(dir_path, "{}").format(request.user)
        dir_path = dir_path_temp
        file_dir = os.path.join(dir_path, request.data['data'])
        self.updateDownloadFile(request.data['data'])
        contentType = self.getContentType(request.data['data'])
        if(request.data['data'].endswith('xlsx')):
            with open(file_dir, "rb") as excel:
                return HttpResponse(excel.read(), content_type=contentType, status=status.HTTP_200_OK)
        elif (request.data['data'].endswith('shp')):
            filename=request.data['data'].replace(".shp","")
            file_dir = self.zipFile(dir_path,filename)
            response = FileResponse(open(file_dir, 'rb'))
            return HttpResponse(response, content_type="application/x-zip-compressed", status=status.HTTP_200_OK)
            #os.remove(os.path.join(dir_path,filename+".zip"))
        else:
            response = FileResponse(open(file_dir, 'rb'))
            return HttpResponse(response, content_type=contentType, status=status.HTTP_200_OK)

class DownloadMapDataAPI(views.APIView): #下載特定的巨量檔案 #傳到LayerV2.jsx
    
    def findMapData(name):
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        search_dir = os.path.join(dir_path, "map_data")
        list_dir = os.listdir(search_dir)
        for dir in list_dir:
            for file in os.listdir(os.path.join(search_dir, dir)):
                if(name in file):
                    return(os.path.join(dir_path, "map_data", dir, file))
        return None      
        
    
    def post(self, request):
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        file_dir = ""
        if(request.data['data'] == "ps"):
            file_dir = os.path.join(dir_path, "map_data", "ps", "ps_mean_v.xy.json")
        elif(request.data['data'] == "彰化水準測量檢測成果表"):
            file_dir = os.path.join(dir_path, "map_data", "changhua", "彰化水準測量檢測成果表.json")
        elif(request.data['data'] == "time_series_108彰化地區地層下陷水準檢測成果表"):
            file_dir = os.path.join(dir_path, "map_data", "changhua", "time_series_108彰化地區地層下陷水準檢測成果表.json")
        elif(request.data['data'] == "雲林水準測量檢測成果表"):
            file_dir = os.path.join(dir_path, "map_data", "yunlin", "雲林水準測量檢測成果表.json")
        elif(request.data['data'] == "time_series_108雲林地區地層下陷水準檢測成果表"):
            file_dir = os.path.join(dir_path, "map_data", "yunlin", "time_series_108雲林地區地層下陷水準檢測成果表.json")
        print(file_dir)
        response = FileResponse(open(file_dir, 'rb'))
        print(response)
        return HttpResponse(response, content_type="application/json", status=status.HTTP_200_OK)

class GnssFunction(views.APIView):#傳到GNSS.jsx
    
    def gnsscrd_to_csv(self,username):
        GnsscrdToCsv(username)
    def gnsscsv_to_geojson(self,username):
        GnsscsvToJson(username)
    def post(self, request):
        #do something
        print("activate gnss")
        if os.path.exists("/root/GNSS_Search_Data/gnss.txt"):
            os.remove("/root/GNSS_Search_Data/gnss.txt")
        #cmd = "/root/GNSS_Search_Data/file.sh"
        #os.system(cmd)
        print("gnss_ok")
        with open ('/root/GNSS_Search_Data/run.sh', 'w') as rsh:
            rsh.writelines('#!/bin/bash\n')
            rsh.writelines('source ~/BERN52/GPS/EXE/LOADGPS.setvar\n')
            rsh.writelines('perl -I ~/BERN52/BPE/ -I ~/BERN52/GPS/EXE/ /root/GPSUSER52/SCRIPT/rnx2snx_pcs.pl {} >> /root/GNSS_Search_Data/gnss.txt\n'.format(str(request.data['text'])))
        cmd = "chmod +777 /root/GNSS_Search_Data/run.sh"
        os.system(cmd)
        cmd1 = "/root/GNSS_Search_Data/run.sh"
        os.system(cmd1)
        self.gnsscrd_to_csv(request.user)
        self.gnsscsv_to_geojson(request.user)
        with open("/root/GNSS_Search_Data/gnss.txt", "r") as gnss:
            resultarr = gnss.read()
        #cmd = "python3 /var/www/html/app-deploy/HydraWeb/python/checkChoushi_editLine_GNSS.py"
        #os.system(cmd)
        return Response({"status":"created", "data":resultarr}, status=status.HTTP_200_OK)

class GNSSListAPIView(views.APIView):  #只傳送在choushui_editLine裡的圖層資料
    
    def post(self,request):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        dir_path2 = os.path.dirname(dir_path)
        result = [os.path.splitext(filename)[0] for filename in os.listdir(os.path.join(dir_path2, "map_data", "GNSS_station"))]
        result2 = [os.path.splitext(filename)[0] for filename in os.listdir(os.path.join(dir_path2, "map_data", "GNSS_Full_station"))]
        final_result = result + result2
        SystemLog.objects.create_log(user=request.user,operation=SystemOperationEnum.USER_READ_HYDRAWEB_LAYER)
        return Response({"status":"created","data":final_result}, status=status.HTTP_200_OK)   
    
class UploadGNSSAPI(views.APIView):#傳到GNSS.jsx
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    parser_classes = (MultiPartParser,)

    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = "/root/GPSDATA/DATAPOOL/RINEX/PPP"
        read_files = os.listdir(dir_path)
        if len(read_files)>0:
            tmp="rm -r /root/GPSDATA/DATAPOOL/RINEX/PPP/*"
            os.system(tmp)
        if(request):
            print(file)
            for f in file:
                print(f)
                counter=0
                filename = os.path.join(dir_path, f.name)
                if os.path.isfile(filename)==True:
                    os.remove(filename)
                    counter=1
                if(f.name.endswith('.21O')):
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(filename, f)
                    print(filename)
            return Response({"message":"File is recieved", "data":[]}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
