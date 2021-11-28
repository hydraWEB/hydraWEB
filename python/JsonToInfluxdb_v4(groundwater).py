import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime

token = "wv8or2EeaXkM_nJVj3ZZ1Fn2p5gCW1VU7D2HBqCPlwXDpTO-9ckmaJsyH9ne-wOSz34yn3pBl8m4_Qk_A5gf9A==" #改成自己的
org = "flexolk"  #改成自己的
bucket = "groundwater_well" #改成自己的
url="http://localhost:8086"

client = influxdb_client.InfluxDBClient(
   url=url,
   token=token,
   org=org
)

write_api = client.write_api(write_options=SYNCHRONOUS)

import json
import os

root = 'C:/Users/User/Downloads/optimization_data' #改成自己的
FileList = os.listdir(root)


for file in FileList:
  with open(root+"/"+file,encoding="utf-8") as f:
    if file.endswith(".json"):
      data = json.load(f)
      write_api.write(bucket=bucket, org=org, record=data)
#10:19
#10:22