import collections
from fileinput import filename
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
# Create your views here.
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
from rest_framework import viewsets, status
from rest_framework import views
import os 
import pymongo
import json
import base64
import fitz
import csv
import re
import pandas as pd
from PIL import Image
from datetime import datetime
from django.core.files.base import ContentFile
from staff.models import SystemLog,SystemOperationEnum
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.parsers import FileUploadParser, JSONParser, MultiPartParser
from django.http import FileResponse, HttpRequest, HttpResponse, JsonResponse
from django.core.files.storage import FileSystemStorage
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
    parser_classes = (MultiPartParser,)

    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        print(request.user)
        if(request):
            for f in file:
                #---------------create a temp edit to remove boundary------------
                if(f.name.endswith('.json')):
                    temp_filename = "temp.json"
                elif(f.name.endswith('.csv')):
                    temp_filename = "temp.csv"
                elif(f.name.endswith('.shp')):
                    temp_filename = "temp.shp"
                elif(f.name.endswith('.shx')):
                    temp_filename = "temp.shx"
                elif(f.name.endswith('.dbf')):
                    temp_filename = "temp.dbf"
                if(temp_filename == "temp.shp" or temp_filename == "temp.shx" or temp_filename == "temp.dbf"):
                    print(dir_path)
                    fs = FileSystemStorage(location=dir_path)
                    fs.save(f.name, f)
                elif(temp_filename != ""):
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
            return Response({"message":"File is recieved"}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
         
class UploadAndConvertToCSVFileAPI(views.APIView):
    parser_classes = (MultiPartParser,)
    
    def jsonTocsv(self, fileName, read_dir, write_dir):
        read_dir_path = os.path.join(read_dir, fileName+'.json')
        write_dir_path = os.path.join(write_dir, fileName+'.csv')
        df = pd.read_json(read_dir_path)
        df.to_csv(write_dir_path, index = None)
          
    def post(self,request):     
        file = request.data.get('file', None)
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        if(request):
            #---------------create a temp edit to remove boundary------------
            if(file.name.endswith('.json')):
                temp_filename = "temp.json"
            if(temp_filename != ""):
                filename = os.path.join(dir_path, file.name)
                fs = FileSystemStorage(location=dir_path)
                fs.save(temp_filename, file)
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
            fname = file.name.replace(".json", "")
            self.jsonTocsv(fname, dir_path, dir_path)
                
            return Response({"message":"File is recieved"}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadAndConvertToJSONFileAPI(views.APIView):
    parser_classes = (MultiPartParser,)
        
    def csvTojson(self, fileName, read_dir, write_dir):
        read_dir_path = os.path.join(read_dir, fileName+'.csv')
        write_dir_path = os.path.join(write_dir, fileName+'.json')
        df = pd.read_csv(read_dir_path)
        df.to_json(write_dir_path)
                  
    def post(self,request):     
        file = request.data.get('file', None)
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        if(request):
            #---------------create a temp edit to remove boundary------------
            if(file.name.endswith('.csv')):
                temp_filename = "temp.csv"
            if(temp_filename != ""):
                filename = os.path.join(dir_path, file.name)
                fs = FileSystemStorage(location=dir_path)
                fs.save(temp_filename, file)
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
            fname = file.name.replace(".csv", "")
            self.csvTojson(fname, dir_path, dir_path)
                
            return Response({"message":"File is recieved"}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
                            
class UploadAndConvertToGEOJSONFileAPI(views.APIView):
    parser_classes = (MultiPartParser,)
        
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
        file = request.data.get('file', None)
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        if(request):
            #---------------create a temp edit to remove boundary------------
            if(file.name.endswith('.csv')):
                temp_filename = "temp.csv"
            elif(file.name.endswith('.shp')):
                temp_filename = "temp.shp"
            if(temp_filename != ""):
                filename = os.path.join(dir_path, file.name)
                fs = FileSystemStorage(location=dir_path)
                fs.save(temp_filename, file)
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
            
            if(file.name.endswith('.shp')):
                fname = file.name.replace(".shp", "")
                print("do something")
            elif(file.name.endswith('.csv')):
                fname = file.name.replace(".csv", "")
                self.csvTogeojson(fname, dir_path, dir_path)
                
            return Response({"message":"File is recieved"}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadAndConvertToSHPFileAPI(views.APIView):
    parser_classes = (MultiPartParser,)
    
    def geojsonToSHP(self, fileName, read_dir, write_dir):
        return 0
              
    def post(self,request):     
        file = request.FILES.getlist('file')
        dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
        dir_path = os.path.join(dir_path, "upload_data")
        all_dir = os.listdir(dir_path)
        temp_filename = ""
        if(request):
            for f in file:
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
                
            return Response({"message":"File is recieved"}, status=status.HTTP_200_OK) 
        else:
            return Response({"message":"File is missing"}, status=status.HTTP_400_BAD_REQUEST)
        
                                  