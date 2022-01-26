import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
from datetime import datetime
import json
import os

token = "IGFIcuExdgqGPVxjtBDo2hUpoeh7r7FXGO-hMrSRd4U0EwB9A2F2Cp2yUf2NvIk2Ndm7UN4tYFvUMHvXkiwLQg==" #改成自己的
org = "hydraweb"  #改成自己的
bucket = "yunlin_taiwan_power_company_data" #改成自己的
url="http://localhost:8086"

client = influxdb_client.InfluxDBClient(
   url=url,
   token=token,
   org=org, #groundwater
   timeout= None,
   debug=True
)

write_api = client.write_api(write_options=SYNCHRONOUS)



root = 'C:/Users/Leong/Downloads/yunlin-20211230T102429Z-001/yunlin' #改成自己的
FileList = os.listdir(root)
start_time = datetime.now()
count = 0
for file in FileList:
  with open(root+"/"+file,encoding="utf-8") as f:
    if file.endswith(".json"):
      count += 1
      print(count, file)
      data = json.load(f)
      write_api.write(bucket=bucket, org=org, record=data)
  os.remove(root+"/"+file)    
      
print("start time= ",start_time)
print("end time= ",datetime.now())

#uploaded count = 6372