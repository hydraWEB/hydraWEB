import os 
import pymongo
import json

#改成自己的
layer_data_dir = 'C:/Users/Leong/Downloads/New folder'
db_name = 'hydraweb'


client = pymongo.MongoClient('mongodb://localhost:27017')
db = client[db_name] 

client = pymongo.MongoClient('mongodb://localhost:27017')

allCollection = db.collection_names()   #改循序


for col in allCollection:
    target_db = client[col]
    collection = db.get_collection(col)
    result = collection.find()
    res_json = []
    result = collection.find()
    print(col)
    if(col != 'yunlin' and col != 'ps'):
        for json in result:
            name = json["name"]
            target_col = target_db[name]
            print(target_col)
            for dt in json['features']:
                results = {}
                results["x"] = dt["geometry"]["coordinates"][0]
                results["y"] = dt["geometry"]["coordinates"][1]
                prop = dt["properties"]
                results.update(prop)
                print(results)
                target_col.insert_one(results)

