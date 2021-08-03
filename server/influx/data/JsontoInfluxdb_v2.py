import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime

token = "wv8or2EeaXkM_nJVj3ZZ1Fn2p5gCW1VU7D2HBqCPlwXDpTO-9ckmaJsyH9ne-wOSz34yn3pBl8m4_Qk_A5gf9A=="
org = "flexolk"
bucket = "flexolk"
url="http://localhost:8086"

client = influxdb_client.InfluxDBClient(
   url=url,
   token=token,
   org=org
)

write_api = client.write_api(write_options=SYNCHRONOUS)

import json
import os

root = 'C:/Users/User/Documents/GitHub/HydraWeb/server/influx/data/json'
FileList = os.listdir(root)


for file in FileList:
    with open(root+"/"+file,encoding="utf-8") as f:
        if file.endswith(".json"):
            row = 0
            data = json.load(f)
            for dt in data:
                measurement = dt['measurement']
                time = dt['time']
                tags = dt['tags']
                fields = dt['fields']
                tagKey = []
                tagValue = []
                fieldKey = []
                fieldValue = []
                for tag in tags:
                    tagKey.append(tag)
                for key in tagKey:
                    tagValue.append(tags[key])
                for field in fields:
                    fieldKey.append(field)
                for key in fieldKey:
                    fieldValue.append(fields[key])       

                p = influxdb_client.Point(measurement).time(time)
                
                for i in range(0,len(tagKey)):
                    p.tag(tagKey[i],tagValue[i])
                for i in range(0,len(fieldKey)):
                    p.field(fieldKey[i],fieldValue[i])
                write_api.write(bucket=bucket, org=org, record=p)
                
