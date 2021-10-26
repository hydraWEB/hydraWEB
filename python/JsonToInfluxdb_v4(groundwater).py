import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime

token = "IGFIcuExdgqGPVxjtBDo2hUpoeh7r7FXGO-hMrSRd4U0EwB9A2F2Cp2yUf2NvIk2Ndm7UN4tYFvUMHvXkiwLQg==" #改成自己的
org = "hydraweb"  #改成自己的
bucket = "optimization_data" #改成自己的
url="http://localhost:8086"

client = influxdb_client.InfluxDBClient(
   url=url,
   token=token,
   org=org
)

write_api = client.write_api(write_options=SYNCHRONOUS)

import json
import os

root = 'C:/Users/Leong/Downloads/optimization_data-20211024T060434Z-001/optimization_data' #改成自己的
FileList = os.listdir(root)


for file in FileList:
  with open(root+"/"+file,encoding="utf-8") as f:
    if file.endswith(".json"):
      data = json.load(f)
      write_api.write(bucket=bucket, org=org, record=data)
#10:19
#10:22