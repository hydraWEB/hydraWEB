import pymongo
import json
import os

root = 'C:/Users/Leong/Downloads/full_data-20211025T134750Z-001/full_data' #改成自己的
FileList = os.listdir(root)
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["ST_NO"]
mycol = mydb["full_data"]

for file in FileList:
  with open(root+"/"+file,encoding="utf-8") as f:
    result = {}
    if file.endswith(".json"):
      data = json.load(f)
      result["ST_NO"] = data[0]["tags"]["ST_NO"]
      result["NAME_C"] = data[0]["tags"]["NAME_C"]
      result["min_time"] = data[0]["time"]
      result["max_time"] = data[-1]["time"]
  x = mycol.insert_one(result)