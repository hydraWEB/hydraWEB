import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime

token = "IGFIcuExdgqGPVxjtBDo2hUpoeh7r7FXGO-hMrSRd4U0EwB9A2F2Cp2yUf2NvIk2Ndm7UN4tYFvUMHvXkiwLQg=="
org = "hydraweb"
bucket = "ttt"
url="http://localhost:8086"

client = influxdb_client.InfluxDBClient(
   url=url,
   token=token,
   org=org
)

write_api = client.write_api(write_options=SYNCHRONOUS)

import json
import os

root = 'C:/Users/Leong/Desktop/hydrawebInflux/ToInfluxDBData'
FileList = os.listdir(root)

with open(root+"/"+"108彰化地區地層下陷水準檢測成果表.json",encoding="utf-8") as f:
    coordinates = []
    time = []
    tagValue = []
    tagKey = []
    fieldValue = []
    fieldKey = []
    row = 0
    record_result = []
    data = json.load(f)
    for i in range (0, len(data)):
      m = data[i]["measurement"]
      print(m)
      p = influxdb_client.Point(m).time(data[i]["time"]).field("Water_Level",data[i]["fields"]["Water_Level"]).tag("樁號",data[i]["tags"]["樁號"]).tag("點名",data[i]["tags"]["點名"]).tag("鄉鎮市",data[i]["tags"]["鄉鎮市"]).tag("TWD97_Y",data[i]["tags"]["TWD97_Y"]).tag("TWD97_X",data[i]["tags"]["TWD97_X"]).tag("lon",data[i]["tags"]["lon"]).tag("lat",data[i]["tags"]["lat"])
      record_result.append(p)
    
    write_api.write(bucket=bucket, org=org, record=record_result)
