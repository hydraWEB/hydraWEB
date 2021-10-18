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

    def query_city(self, bucket):
        token = os.environ.get('INFLUX_TOKEN')
        org = os.environ.get('INFLUX_ORG')

        type = self.request.query_params.get('type', None)
        data = []
        client = influxdb_client.InfluxDBClient(
            url=self.url,
            token=token,
            org=org
        )
        geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        query_api = client.query_api()
      
        query = f'from (bucket:"{bucket}")\
        |> range(start: 1970-01-01T00:00:00Z)'
        result = query_api.query(query=query, org = org)
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
        res_json2 = []
        waterjsondt = self.query_city("groundwater_well")
        res_json2.append({"name": "Ground Water Well", "data": waterjsondt, "time_serie":False})
        resultarr.append({"name": "", "file":res_json2})
        for col in allCollection:
            collection = db.get_collection(col)
            result = collection.find()
            i = 0
            res_json = []
            
            for dt in result:
                is_time_series = False
                feat = dt['features']
                new_json = {
                    "type": "FeatureCollection",
                    "features": feat
                }
                #if dt['name'].startswith("time_serie"):
                #    is_time_series = True
                #    res_json.append({"name": dt['name'], "data": new_json,"time_serie":is_time_series})
                
                if dt['name'].startswith("time_series_108雲林地區地層下陷水準檢測成果表"):
                    is_time_series = True
                    yljsondt = self.query_city("Yunlin")
                    
                    res_json.append({"name": dt['name'], "data": yljsondt,"time_serie":is_time_series})
                elif dt['name'].startswith("time_series_108彰化地區地層下陷水準檢測成果表"):
                    is_time_series = True
                    zhjsondt = self.query_city("Changhua")
                    res_json.append({"name": dt['name'], "data": zhjsondt,"time_serie":is_time_series})
                else:
                    is_time_series = False
                    res_json.append({"name": dt['name'], "data": new_json,"time_serie":is_time_series})
                i = i + 1
            resultarr.append({"name": col, "file":res_json})
        

        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)   

class WaterLevelAPI(views.APIView):
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"

    def post(self,request):
        st_no = request.data['st_no']
        res = self.get_target_station_data("groundwater",st_no)
        return Response({"status":"created","data":res}, status=status.HTTP_200_OK)  
        
    def get_target_station_data(self, bucket, st_no):
        token = "IGFIcuExdgqGPVxjtBDo2hUpoeh7r7FXGO-hMrSRd4U0EwB9A2F2Cp2yUf2NvIk2Ndm7UN4tYFvUMHvXkiwLQg=="
        org = "hydraweb"
        url = "http://localhost:8086"
        resultArr = []
        data = []
        waterlevel = []
        time_arr = []
        client = influxdb_client.InfluxDBClient(
            url=self.url,
            token=token,
            org=org
        )
        query_api = client.query_api()
        query = f'from (bucket:"{bucket}")\
        |> range(start: 1970-01-01T00:00:00Z)\
        |> filter(fn: (r) => r["ST_NO"] == "{st_no}")'
        result = query_api.query(query=query, org = org)
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

    def get_all_station(self,collection):
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client['ST_NO']
        allCollection = db.collection_names()
        resultArr = []
        for col in allCollection:
            collection = db.get_collection(col)
            result = collection.find()
            for dt in result:
                temp  = []
                temp.append(dt["ST_NO"])
                temp.append(dt["NAME_C"])
                resultArr.append(temp)
        return resultArr

    def get(self,request):
        resultarr = self.get_all_station("ST_NO")
        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)  