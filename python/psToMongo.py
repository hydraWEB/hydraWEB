import pymongo
import json
import os

root = 'server/hydraweb/data/ps' #改成自己的
FileList = os.listdir(root)
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["hydraweb"]
mycol = mydb["ps"]

for file in FileList:
  with open(root+"/"+file,encoding="utf-8") as f:
    
    if file.endswith(".json"):
      data = json.load(f)
      for dt in data['features']:
        result = {}
        result["x"] = dt['geometry']['coordinates'][0]
        result["y"] = dt['geometry']['coordinates'][1]
        result["z"] = dt['properties']
        x = mycol.insert_one(result)