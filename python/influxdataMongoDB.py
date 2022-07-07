import pymongo
import json
import os
import influxdb_client
from datetime import datetime
from influxdb_client.client.write_api import SYNCHRONOUS
#influxdb setup
url = "http://localhost:8086"
token = "b0W9OqcWgFhiGqhvqoWi6w4FvfeFlJWgwLuWZc_yo70ZtEMntCppgnVpTKnngr836R68rJBmSaLc_2JWrK5iBA=="
org = "groundwater"
influx_bucket = "pumping_station_yunlin"

#mongo setup
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["ST_NO"]
mycol = mydb["Pumping_Yunlin"]


influxclient = influxdb_client.InfluxDBClient(
            url=url,
            token=token,
            org=org
        )
query_api = influxclient.query_api()
#|> range(start: 1970-01-01T00:00:00Z)\
query = f'from (bucket:"{influx_bucket}") |> range(start: 1970-01-01T00:00:00Z)'
print("start")
start_time = datetime.now()
temp_arr = []
result = query_api.query(query= query, org = org)
for table in result:
    min_time = 0
    max_time = 0
    ST_NO = ""
    for record in table.records:
        
        ST_NO = record["_measurement"]
        if(min_time == 0 or min_time > record["_time"]):
            min_time = record["_time"]
        if(max_time == 0 or max_time < record["_time"]):
            max_time = record["_time"]

    insert_result = {}
    new_min_time = str(min_time)
    new_max_time = str(max_time)
    new_min_time = new_min_time.replace(" ","T")
    new_min_time = new_min_time.replace("+00:00","Z")
    new_max_time = new_min_time.replace(" ","T")
    new_max_time = new_min_time.replace("+00:00","Z")
    insert_result["ST_NO"] = ST_NO
    insert_result["NAME_C"] = "none"
    insert_result["min_time"] = new_min_time
    insert_result["max_time"] = new_max_time
    x = mycol.insert_one(insert_result)


""" result = {}
result["ST_NO"] = data[0]["tags"]["ST_NO"]
result["NAME_C"] = data[0]["tags"]["NAME_C"]
result["min_time"] = data[0]["time"]
result["max_time"] = data[-1]["time"]
 """