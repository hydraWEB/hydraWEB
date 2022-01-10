import pymongo
import json
import os

root = 'C:/Users/Leong/Downloads/changhua-20211230T102430Z-001/changhua' #改成自己的
FileList = os.listdir(root)
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["changhua"]
mycol = mydb["110年水井電關聯資料"]

for file in FileList:
    with open(root+"/"+file,encoding="utf-8") as f:
        result = {}
        if file.endswith(".json"):
            data = json.load(f)
            for dt in data:
                for d in dt:
                    
                    print(d)
                break
    break
  #x = mycol.insert_one(result)