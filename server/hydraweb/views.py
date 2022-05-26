import collections
from fileinput import filename
from sqlite3 import converters
from tempfile import NamedTemporaryFile
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
import shutil
import re
import pandas as pd
from PIL import Image
from datetime import date, datetime
from django.core.files.base import ContentFile
from staff.models import SystemLog,SystemOperationEnum
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.parsers import FileUploadParser, JSONParser, MultiPartParser
from django.http import FileResponse, HttpRequest, HttpResponse, JsonResponse
from django.core.files.storage import FileSystemStorage
from .record_upload_file import RecordUploadFile
from collections import OrderedDict

import pprint

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
                f = open(f'{dir_path}/data/{dir}/{js}',"r",encoding="utf-8")
                if js.startswith("time_series_"):
                    is_time_series = True
                else :
                    is_time_series = False
                json_data = json.load(f)
                res_json.append({"name":f"{js}","data":json_data,"time_serie":is_time_series})
            result.append({"name":f"{dir}","file":res_json})
        
        SystemLog.objects.create_log(user=request.user,operation=SystemOperationEnum.USER_READ_HYDRAWEB_LAYER)
        return Response({"status":"created","data":result}, status=status.HTTP_200_OK)   

class LayerListAPIView(views.APIView):      #INFLUX + MONGO
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"
    token = os.environ.get('INFLUX_TOKEN')
    org = os.environ.get('INFLUX_ORG')
    
    def query_file(self):
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        json_data = []
        for file in all_dir:
            if(file.endswith(".json")):
                file_path = os.path.join(dir_path,file)
                f = open(file_path,"r",encoding="utf-8")
                json_read = json.load(f)
                json_data.append({"name": file, "data": json_read,"time_serie":False,"tag":[]})
        return json_data
    
    def query_city(self, bucket):
        client = influxdb_client.InfluxDBClient(
            url=self.url,
            token=self.token,
            org=self.org
        )
        geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        query_api = client.query_api()
      
        query = f'from (bucket:"{bucket}")\
        |> range(start: 1970-01-01T00:00:00Z)'
        result = query_api.query(query=query, org = self.org)
        feature = []

        for table in result:
            for record in table.records:
                ##record.values is a dict 
                properties = {}
                geometry = {
                    "type" : "Point"
                }
                newKey = []
                coordinates = [0,0] 
                newValue = []
                for key in record.values:
                    newKey.append(key)
                    newValue.append(record.values[key])
                for i in range(4, len(record.values)):
                    if(newKey[i] != "lat" and newKey[i] != "lon" and newKey[i] != "_field" and newKey[i] != "_time"):
                        properties[newKey[i]] = newValue[i]
                    elif(newKey[i] == "_time"):
                        properties['time'] = newValue[i].isoformat()
                    elif(newKey[i] == "lon"):
                        coordinates[0] = float(newValue[i])
                    elif(newKey[i] == "lat"):
                        coordinates[1] = float(newValue[i])
                geometry["coordinates"] = coordinates
                ft = {
                    "type" : "Feature",
                    "geometry" : geometry,
                    "properties" : properties
                }
                feature.append(ft)
        geojson = {
            "type": "FeatureCollection",
            "features": feature
        }
        return geojson

    def query_influxdb(self, bucket):
        client = influxdb_client.InfluxDBClient(
            url=self.url,
            token=self.token,
            org=self.org
        )
        geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        query_api = client.query_api()
      
        query = f'from (bucket:"{bucket}")\
        |> range(start: 2007-02-01T00:00:00Z, stop: 2007-02-02T10:00:00Z)'
        result = query_api.query(query=query, org = self.org)
        print("done")
        feature = []
        for table in result:
            for record in table.records:
                ##record.values is a dict 
                properties = {}
                geometry = {
                    "type" : "Point"
                }
                newKey = []
                coordinates = [0,0] 
                newValue = []
                for key in record.values:
                    newKey.append(key)
                    newValue.append(record.values[key])
                for i in range(4, len(record.values)):
                    if(newKey[i] != "LAT" and newKey[i] != "LON" and newKey[i] != "_field" and newKey[i] != "_time"):
                        properties[newKey[i]] = newValue[i]
                    elif(newKey[i] == "_time"):
                        properties['time'] = newValue[i].isoformat()
                    elif(newKey[i] == "LON"):
                        coordinates[0] = float(newValue[i])
                    elif(newKey[i] == "LAT"):
                        coordinates[1] = float(newValue[i])
                geometry["coordinates"] = coordinates
                ft = {
                    "type" : "Feature",
                    "geometry" : geometry,
                    "properties" : properties
                }
                feature.append(ft)
            
        geojson = {
            "type": "FeatureCollection",
            "features": feature
        }
        return geojson
    
    def post(self,request):
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client[os.environ.get('MONGODB_DB')]
        databases = client.list_database_names()    #get all database from mongodb
        
        #remove unwanted database
        databases.remove("admin")              
        databases.remove("config")
        databases.remove("local")
        databases.remove("ps")      #file too large, cause rendering slow
        databases.remove("ST_NO")
        databases.remove("tags")
        databases.remove("users_space")
        resultarr = []
        new_json = {}       #use to store mongodb data in json format
        for db in databases:    
            tempDB = client[db]     #connect to the database
            tempCollection = tempDB.list_collection_names()
            is_time_series = False
            res_json = []
            print(db)
            for col in tempCollection:
                tags = []
                collection = tempDB.get_collection(col)
                result = collection.find()
                features = []
                is_time_series = False
                for dt in result:
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
                    inside_json = {
                        "type": "Feature",
                            "geometry": {
                                "type": "Point",
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
            #if(db == 'changhua'):
            #    res_json.append({"name": "彰化水井台電關聯資料", "data": self.query_influxdb("changhua_taiwan_power_company_data"),"time_serie":is_time_series})
            #if(db == "yunlin"):
            #    res_json.append({"name": "雲林水井台電關聯資料", "data": self.query_influxdb("yunlin_taiwan_power_company_data"),"time_serie":is_time_series})
                
            resultarr.append({"name": db, "file":res_json})
        #resultarr.append({"name":"Upload", "file":self.query_file()})
        SystemLog.objects.create_log(user=request.user,operation=SystemOperationEnum.USER_READ_HYDRAWEB_LAYER)
        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)   

class WaterLevelAPI(views.APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"
    token = os.environ.get('INFLUX_TOKEN')
    bucket = os.environ.get('INFLUX_BUCKET')
    org = os.environ.get('INFLUX_ORG')

    def post(self,request):     #從influx拿該站點資料
        print(request.data)
        get_dt_time = datetime.now()
        print("get data time = ", get_dt_time)
        st_no = request.data['st_no']
        start_time = request.data['start_time']
        end_time = request.data['end_time']
        #average parameter
        avg_day = request.data['avg_day']
        avg_hour = request.data['avg_hour']
        avg_minute = request.data['avg_minute']
        
        res = self.get_target_station_data(st_no,start_time,end_time)       #要改
        get_dt_time_fin = datetime.now()
        print("get date end time = ", get_dt_time_fin)
        print(get_dt_time_fin-get_dt_time)
        return Response({"status":"created","data":res}, status=status.HTTP_200_OK)  
        
    def get_target_station_data(self, st_no, start_time, end_time):
        resultArr = []
        waterlevel = []
        time_arr = []
        client = influxdb_client.InfluxDBClient(
            url=self.url,
            token=self.token,
            org=self.org
        )
        query_api = client.query_api()
        #|> range(start: 1970-01-01T00:00:00Z)\
        query = f'from (bucket:"{self.bucket}")\
        |> range(start: {start_time}, stop: {end_time})\
        |> filter(fn: (r) => r["ST_NO"] == "{st_no}")\
        |> filter(fn: (r) => r._field == "Water_Level" and r["_value"] > -9998)'
        result = query_api.query(query=query, org = self.org)
        for table in result:
            for i,t in enumerate(table):
                time_arr.append(t.values["_time"])
                waterlevel.append(t.values["_value"])
        for i in range(0,len(time_arr)):
            temp = []
            temp.append(time_arr[i])
            temp.append(waterlevel[i])
            resultArr.append(temp)
        return resultArr
    
class WaterLevelAllStationAPI(views.APIView):
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"

    def get_all_station(self,collection):   #從mongo拿所有的站點資料
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client['ST_NO']        #get database name ST_NO
        print(db)
        allCollection = db.list_collection_names()
        resultArr = []
        for col in allCollection:
            if(col == 'full_data' or col == 'Pumping_Changhua' or col == 'Pumping_Yunlin'):
                collection = db.get_collection(col)
                result = collection.find()
                for dt in result:
                    temp  = []
                    temp.append(dt["ST_NO"])
                    temp.append(dt["NAME_C"])
                    temp.append(dt["min_time"])
                    temp.append(dt["max_time"])
                    dict_result = {"name":col, "data":temp}
                    resultArr.append(dict_result)
        return resultArr

    def get(self,request):
        resultarr = self.get_all_station("ST_NO")
        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)  
    
    
class PDFAndPngAPI(views.APIView):
    
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


class AllTagsAPI(views.APIView):        #從mongodb拿tags資料
            
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
    
class TagsAPI(views.APIView):
    
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


class WaterLevelDownloadAPI(views.APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"
    token = os.environ.get('INFLUX_TOKEN')
    bucket = os.environ.get('INFLUX_BUCKET')
    org = os.environ.get('INFLUX_ORG')

    def post(self,request):     #從influx拿該站點資料
        st_no = request.data['st_no']
        start_time = request.data['start_time']
        end_time = request.data['end_time']
        res = self.get_target_station_data_and_download(st_no,start_time,end_time)       #要改
        return res 
        
    def get_target_station_data_and_download(self, st_no, start_time, end_time):
        print(start_time)
        print(end_time)
        client = influxdb_client.InfluxDBClient(
            url=self.url,
            token=self.token,
            org=self.org
        )
        query_api = client.query_api()
        #|> range(start: 1970-01-01T00:00:00Z)\
        influxdb_csv_result = query_api.query_csv(f'from (bucket:"{self.bucket}")\
        |> range(start: {start_time}, stop: {end_time})\
        |> filter(fn: (r) => r["ST_NO"] == "{st_no}")\
        |> filter(fn: (r) => r._field == "Water_Level" and r["_value"] > -9998)')
        #開始打開.csv的檔案
        response = HttpResponse(
            content_type='text/csv',
        )
        count = 0
        writer = csv.writer(response)
        to_copy_idx = []
        content = []
        for row in influxdb_csv_result:
            count += 1
            if count == 4:
                for i,x in enumerate(row):
                    if(x == "_time" or x == "_value" or x == "NAME_C" or x =="ST_NO"):
                        to_copy_idx.append(i)
                        content.append(x)
                writer.writerow(content)       
                break
        for row in influxdb_csv_result:
            count += 1
            content = []
            if count > 4:
                for i,x in enumerate(row):
                    if(i in to_copy_idx):
                        content.append(x)
            writer.writerow(content)
        return response
        
class UploadFileAPI(views.APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    parser_classes = (MultiPartParser,)
    
    def Record_File(self, username, filename, dir_path, counter):
        RecordUploadFile(username, filename, dir_path, counter)

    def post(self,request):     #only upload
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        dir_path_temp = os.path.join(dir_path, "{}").format(request.user)
        print("only upload")
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
                elif(f.name.endswith('.xlsx')):
                    temp_filename = "temp.xlsx"
                if(temp_filename == "temp.shp" or temp_filename == "temp.shx" or temp_filename == "temp.dbf" or temp_filename == "temp.xlsx"):
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(f.name, f)
                elif(temp_filename != ""):
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
                        print(encode)
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
            return Response({"message":"File is recieved", "data":[]}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
         
class UploadAndConvertToCSVFileAPI(views.APIView): # json  and geojson convert to csv
    parser_classes = (MultiPartParser,)
    
    def recordUploadFile(self, username, filename, filepath):
        header=['file_path','file_name','username','last_download','last_created','download_count']
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        file_dir = os.path.join(dir_path,"file_record.csv")
        if(os.path.isfile(file_dir)):
            with open(file_dir, 'a',encoding="UTF-8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()
        else:
            with open(file_dir, 'w+',encoding="UTF-8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow(header)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()
    
    def jsonTocsv(self, fileName, read_dir, write_dir):
        read_dir_path = os.path.join(read_dir, fileName+'.json')
        write_dir_path = os.path.join(write_dir, fileName+'.csv')
        df = pd.read_json(read_dir_path)
        df.to_csv(write_dir_path, index = None)
        
    def geojsonTocsv(self, fileName, read_dir, write_dir):
        read_dir_path = os.path.join(read_dir, fileName+'.json')
        write_dir_path = os.path.join(write_dir, fileName+'.csv')
        with open (read_dir_path, 'r', encoding='utf-8') as jsonfile:
            data=json.load(jsonfile)
            header = ['wgs84(x)','wgs84(y)']
            temp=list(data['features'][0]['properties'])
            for i in range(0,len(temp)):
                header.append(temp[i])
            with open(write_dir_path, 'w',encoding="UTF-8") as out_file:
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
                    
    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        converted_filename = []
        if(request):
            for f in file:
                self.recordUploadFile(request.user, f.name, dir_path)
                #---------------create a temp edit to remove boundary------------
                temp_filename = "temp.json"
                converted_filename.append(f.name.replace("json", "csv"))
                if(temp_filename != ""):
                    filename = os.path.join(dir_path, f.name)
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(temp_filename, f)
                #---------------create a temp edit to remove boundary------------
                    with open(os.path.join(dir_path, temp_filename), "r", encoding='utf-8') as read:   #read the temp file
                        with open(filename, 'w', encoding='utf-8') as writefile:                       #create newfile is not exist
                            readline = read.readlines()
                            for line in readline:
                                if not (line.startswith("------") or line.startswith("Content-") or line.startswith("bKit")):     #write everything except boundary
                                    writefile.write(line)
                            writefile.close()
                        read.close()
                check_is_geojson=0
                with open (filename, 'r', encoding='utf-8') as jsonfile:
                    data=json.load(jsonfile)
                    if 'geometry' in data['features'][0].keys():
                        check_is_geojson=1
                    else:
                        check_is_geojson=0
                if check_is_geojson==0:
                    os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file
                    fname = f.name.replace(".json", "")
                    self.jsonTocsv(fname, dir_path, dir_path)
                    self.recordUploadFile(request.user, fname+".csv", dir_path)
                else:
                    os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file
                    fname = f.name.replace(".json", "")
                    self.geojsonTocsv(fname, dir_path, dir_path)
                    self.recordUploadFile(request.user, fname+".csv", dir_path)
            return Response({"message":"File is recieved", "data":converted_filename}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadAndConvertToJSONFileAPI(views.APIView):
    parser_classes = (MultiPartParser,)
    
    def recordUploadFile(self, username, filename, filepath):
        header=['file_path','file_name','username','last_download','last_created','download_count']
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        file_dir = os.path.join(dir_path,"file_record.csv")
        if(os.path.isfile(file_dir)):
            with open(file_dir, 'a',encoding="UTF-8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()
        else:
            with open(file_dir, 'w+',encoding="UTF-8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow(header)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()

    def csvTojson(self, fileName, read_dir, write_dir):
        read_dir_path = os.path.join(read_dir, fileName+'.csv')
        write_dir_path = os.path.join(write_dir, fileName+'.json')
        df = pd.read_csv(read_dir_path)
        df.to_json(write_dir_path)
                  
    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        converted_filename = []
        if(request):
            for f in file:
                self.recordUploadFile(request.user, f.name, dir_path)
                #---------------create a temp edit to remove boundary------------
                if(f.name.endswith('.csv')):
                    temp_filename = "temp.csv"
                    converted_filename.append(f.name.replace("csv", "json"))
                if(temp_filename != ""):
                    filename = os.path.join(dir_path, f.name)
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(temp_filename, f)
                #---------------create a temp edit to remove boundary------------
                    with open(os.path.join(dir_path, temp_filename), "r", encoding='utf-8') as read:   #read the temp file
                        with open(filename, 'w', encoding='utf-8') as writefile:                       #create newfile is not exist
                            readline = read.readlines()
                            for line in readline:
                                if not (line.startswith("------") or line.startswith("Content-") or line.startswith("bKit")):     #write everything except boundary
                                    writefile.write(line)
                            writefile.close()
                        read.close()
                os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file
                fname = f.name.replace(".csv", "")
                self.csvTojson(fname, dir_path, dir_path)
                self.recordUploadFile(request.user, fname+".json", dir_path)
            return Response({"message":"File is recieved", "data":converted_filename}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
                            
class UploadAndConvertToGEOJSONFileAPI(views.APIView):
    parser_classes = (MultiPartParser,)
    
    def recordUploadFile(self, username, filename, filepath):
        header=['file_path','file_name','username','last_download','last_created','download_count']
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        file_dir = os.path.join(dir_path,"file_record.csv")
        if(os.path.isfile(file_dir)):
            with open(file_dir, 'a',encoding="UTF-8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()
        else:
            with open(file_dir, 'w+',encoding="UTF-8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow(header)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()
        
    def csvTogeojson(self, fileName, read_dir, write_dir):
        li = []
        read_dir_path = os.path.join(read_dir, fileName+'.csv')
        write_dir_path = os.path.join(write_dir, fileName+'.json')
        with open(read_dir_path, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            coord_location = [None] * 2
            property_key = {}
            count = 0
            features = []
            for tags in reader:
                property_dict = {}
                coordinate = []
                if(count == 0):
                    for idx,t in enumerate(tags):
                        if(t == 'lat' or t == 'LAT' or t == 'latitude' or t =='Latitude'):
                            coord_location[0] = idx
                        elif(t == 'lon' or t == 'LON' or t == 'longtitude' or t =='Longtitude' or t == 'lng'):
                            coord_location[1] = idx
                        else:
                            property_key[idx] = t
                else:
                    for idx,t in enumerate(tags):
                        if(idx not in coord_location):
                            property_dict[property_key[idx]] = t 
                    coordinate = [int(tags[coord_location[0]]), int(tags[coord_location[1]])] 
                    temp = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": coordinate
                        },
                        "properties": property_dict
                    }
                    features.append(temp)
                count+=1 
            csvfile.close()
        geojson = {
            "type": "FeatureCollection",
            "features":features
        }
        with open(write_dir_path, 'w') as f:
            f.write(json.dumps(geojson, sort_keys=False, indent=4))
              
    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        converted_filename = []
        if(request):
            for f in file:
                self.recordUploadFile(request.user, f.name, dir_path)
                #---------------create a temp edit to remove boundary------------
                if(f.name.endswith('.csv')):
                    temp_filename = "temp.csv"
                    converted_filename.append(f.name.replace(".csv", ".json"))
                elif(f.name.endswith('.shp')):
                    temp_filename = "temp.shp"
                    converted_filename.append(f.name.replace(".shp", ".json"))
                if(temp_filename != ""):
                    filename = os.path.join(dir_path, f.name)
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(temp_filename, f)
                #---------------create a temp edit to remove boundary------------
                    with open(os.path.join(dir_path, temp_filename), "r", encoding='utf-8') as read:   #read the temp file
                        with open(filename, 'w', encoding='utf-8') as writefile:                       #create newfile is not exist
                            readline = read.readlines()
                            for line in readline:
                                if not (line.startswith("------") or line.startswith("Content-") or line.startswith("bKit")):     #write everything except boundary
                                    writefile.write(line)
                            writefile.close()
                        read.close()
                os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file
                if(f.name.endswith('.shp')):
                    fname = f.name.replace(".shp", "")
                    self.recordUploadFile(request.user, fname+'.json', dir_path)
                    print("do something")
                elif(f.name.endswith('.csv')):
                    fname = f.name.replace(".csv", "")
                    self.csvTogeojson(fname, dir_path, dir_path)
                    self.recordUploadFile(request.user, fname+'.json', dir_path)
            return Response({"message":"File is recieved", "data":converted_filename}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadAndConvertToSHPFileAPI(views.APIView):
    parser_classes = (MultiPartParser,)
    
    def recordUploadFile(self, username, filename, filepath):
        header=['file_path','file_name','username','last_download','last_created','download_count']
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        file_dir = os.path.join(dir_path,"file_record.csv")
        if(os.path.isfile(file_dir)):
            with open(file_dir, 'a',encoding="UTF-8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()
        else:
            with open(file_dir, 'w+',encoding="UTF-8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow(header)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()
    
    def geojsonToSHP(self, fileName, read_dir, write_dir):
        return 0
              
    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        converted_filename = ""
        if(request):
            for f in file:
                self.recordUploadFile(request.user, f.name, dir_path)
            #---------------create a temp edit to remove boundary------------
                if(f.name.endswith('.csv')):
                    temp_filename = "temp.csv"
                elif(f.name.endswith('.shp')):
                    temp_filename = "temp.shp"
                if(temp_filename != ""):
                    filename = os.path.join(dir_path, f.name)
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(f.name, f)
                #---------------create a temp edit to remove boundary------------
                    with open(os.path.join(dir_path, temp_filename), "r", encoding='utf-8') as read:   #read the temp file
                        with open(filename, 'w', encoding='utf-8') as writefile:                       #create newfile is not exist
                            readline = read.readlines()
                            for line in readline:
                                if not (line.startswith("------") or line.startswith("Content-") or line.startswith("bKit")):     #write everything except boundary
                                    writefile.write(line)
                            writefile.close()
                        read.close()
                    os.remove(os.path.join(dir_path, temp_filename))    #delete the temp file
                fname = f.name.replace(".json", "")
            self.geojsonToSHP(fname, dir_path, dir_path)
            self.recordUploadFile(request.user, fname+".shp", dir_path)
            self.recordUploadFile(request.user, fname+".shx", dir_path)
            self.recordUploadFile(request.user, fname+".dbf", dir_path)
            return Response({"message":"File is recieved"}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
    
class DownloadFileListAPI(views.APIView):
    
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
            temp = []
            if(r['username'] == str(username)):
                temp.append(r['file_name'])
                temp.append(r['download_count'])
                resultArr.append(temp)
        
        return Response({"status":"created","data":resultArr}, status=status.HTTP_200_OK)  

class DownloadFileAPI(views.APIView):       #下載被選中的檔案
    permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    
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
    
    def zipFile(self, filepath, filename):
        print("hi")
        dir_path = os.path.join(filepath, filename)
        filenames = [dir_path+".shp"]
        with zipfile.ZipFile(os.path.join(filepath,filename+'.zip'), mode ='w') as archive:
            for fname in filenames:
                archive.write(fname, os.path.basename(fname))
        response = open(os.path.join(filepath,filename+".zip"), 'rb')
        resp = HttpResponse(response, content_type = "application/x-zip-compressed", status=status.HTTP_200_OK)
        return resp          
    
    def getContentType(self, filename):
        ctDict = {
            "json" : "application/json",
            "csv" : "text/csv",
            "shp" : "application/octet-stream",
            "shx" : "x-gis/x-shapefile",
            "dbf" : "application/octet-stream",
            "zip" : "application/x-zip-compressed",
            "xlsx" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
        if(filename.endswith("json")): return ctDict['json']
        elif(filename.endswith("csv")): return ctDict['csv']
        elif(filename.endswith("shp")): return ctDict['shp']
        elif(filename.endswith("shx")): return ctDict['shx']
        elif(filename.endswith("dbf")): return ctDict['dbf']
        elif(filename.endswith("xlsx")): return ctDict['xlsx']
        
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
        
        else:
            response = FileResponse(open(file_dir, 'rb'))
            return HttpResponse(response, content_type=contentType, status=status.HTTP_200_OK)
        
        