from django.shortcuts import render
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
from rest_framework import viewsets, status
from rest_framework import views
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
import os
import datetime
# Create your views here.


class MapAPIView(views.APIView):
    # permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"

    def query_city(self, city):
        token = os.environ.get('INFLUX_TOKEN')
        org = os.environ.get('INFLUX_ORG')
        bucket = os.environ.get('INFLUX_BUCKET')

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
        |> range(start: 1970-01-01T00:00:00Z)\
        |> filter(fn: (r) => r["_value"] == "{city}")'
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
                        properties[newKey[i]] = newValue[i].isoformat()
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
        dir_path = os.path.dirname(os.path.realpath(__file__))
        all_dir = os.listdir(f"{dir_path}\\data")
        result = []
        yljsondt = self.query_city("Yunlin")
        zhjsondt = self.query_city("Changhua")
        res_json = []
        res_json.append({"name":f"Yunlin","data":yljsondt,"is_time_serie":True})
        res_json.append({"name":f"Changhua","data":zhjsondt,"is_time_serie":True})
        result.append({"name":f"time series data","file":res_json})
        return Response({"status":"created","data":result}, status=status.HTTP_200_OK)   

