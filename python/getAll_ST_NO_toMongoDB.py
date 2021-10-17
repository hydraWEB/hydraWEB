import pymongo
import json
import os

root = 'C:/Users/Leong/Downloads/groundwater-20211012T125833Z-001/groundwater' #改成自己的
FileList = os.listdir(root)
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["ST_NO"]
mycol = mydb["ST_NO"]

for file in FileList:
  with open(root+"/"+file,encoding="utf-8") as f:
    result = {}
    if file.endswith(".json"):
      data = json.load(f)
      result["ST_NO"] = data[0]["tags"]["ST_NO"]
      result["NAME_C"] = data[0]["tags"]["NAME_C"]
  x = mycol.insert_one(result)