import influxdb_client
import os
import json
from influxdb_client.client.write_api import SYNCHRONOUS
from django.db import models

# Create your models here.
class Influx():

    token = "IGFIcuExdgqGPVxjtBDo2hUpoeh7r7FXGO-hMrSRd4U0EwB9A2F2Cp2yUf2NvIk2Ndm7UN4tYFvUMHvXkiwLQg=="
    org = "hydraweb"
    bucket = "hydraweb"
    url="http://localhost:8086"
    client = influxdb_client.InfluxDBClient(
        url=url,
        token=token,
        org=org
    )

    def jsontoinflux(self, FileList, root):
        for file in FileList:
            with open(root+"/"+file,encoding="utf-8") as f:
                row = 0
                data = json.load(f)
                for features in data['features']:
                    print(features)
                    zcor = features['properties']
                    break
                    #p = influxdb_client.Point(row).field("type", typ).field("X coordination", xcor).field("Y coordination", ycor).field("Z coordination", zcor).field("type", typ)
                    row = row + 1
                    #write_api.write(bucket=bucket, org=org, record=p)
                print(row)

    def readData(self):
        query_api = client.query_api()
        query = 'from (bucket:"hydraweb")\
        |> range(start: -10d)\
        |> filter(fn:(r) => r._field == "X coordination" )\
        |> filter(fn:(r) => r._field == "X coordination" )'
        result = client.query_api().query(org=org, query=query)

        results = []
        for table in result:
            for record in table.records:
                results.append((record.get_field(), record.get_value()))

        #print(results)
        print(len(results))