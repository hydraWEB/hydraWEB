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


        return Response({"status":"created","data":result}, status=status.HTTP_200_OK)   

class LayerListAPIView(views.APIView):      #INFLUX + MONGO
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"
    token = os.environ.get('INFLUX_TOKEN')
    org = os.environ.get('INFLUX_ORG')
    
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

    def get(self,request):
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client['hydraweb']
        allCollection = db.collection_names()
        resultarr = []
        for col in allCollection:
            collection = db.get_collection(col)
            result = collection.find()
            res_json = []
            if col == 'ps':
                """ for dt in result:
                    is_time_series = False
                    feat = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates" : [dt['x'],dt['y']]
                        },
                        "properties": dt['z']
                    }
                    feats.append(feat)
                new_json = {
                    "type": "FeatureCollection",
                    "features": feats
                }
                res_json.append({"name": "ps_mean_v.xy.json", "data": new_json,"time_serie":is_time_series})
                resultarr.append({"name": col, "file":res_json}) """
            else:
                for dt in result:
                    is_time_series = False
                    feat = dt['features']
                    new_json = {
                        "type": "FeatureCollection",
                        "features": feat
                    }
                    
                    if dt['name'].startswith("time_series_108雲林地區地層下陷水準檢測成果表"):
                        is_time_series = True
                        res_json.append({"name": dt['name'], "data": new_json,"time_serie":is_time_series})
                    elif dt['name'].startswith("time_series_108彰化地區地層下陷水準檢測成果表"):
                        is_time_series = True
                        res_json.append({"name": dt['name'], "data": new_json,"time_serie":is_time_series})
                    else:
                        is_time_series = False
                        res_json.append({"name": dt['name'], "data": new_json,"time_serie":is_time_series})
                resultarr.append({"name": col, "file":res_json})
        

        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)   

class WaterLevelAPI(views.APIView):
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"
    token = os.environ.get('INFLUX_TOKEN')
    bucket = os.environ.get('INFLUX_BUCKET')
    org = os.environ.get('INFLUX_ORG')

    def post(self,request):     #從influx拿該站點資料
        print(request.data)
        st_no = request.data['st_no']
        start_time = request.data['start_time']
        end_time = request.data['end_time']
        res = self.get_target_station_data(st_no,start_time,end_time)       #要改
        return Response({"status":"created","data":res}, status=status.HTTP_200_OK)  
        
    def get_target_station_data(self, st_no, start_time, end_time):
        print(start_time)
        print(end_time)
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
        db = client['ST_NO']        #要改
        allCollection = db.collection_names()
        resultArr = []
        for col in allCollection:
            if(col == 'optimization_data'):
                collection = db.get_collection(col)
                result = collection.find()
                for dt in result:
                    temp  = []
                    temp.append(dt["ST_NO"])
                    temp.append(dt["NAME_C"])
                    temp.append(dt["min_time"])
                    temp.append(dt["max_time"])
                    resultArr.append(temp)
        return resultArr

    def get(self,request):
        resultarr = self.get_all_station("ST_NO")
        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)  