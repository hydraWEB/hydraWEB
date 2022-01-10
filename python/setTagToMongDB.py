import os 
import pymongo
import json

client = pymongo.MongoClient('mongodb://localhost:27017')
databases = client.list_database_names()
databases.remove("admin")
databases.remove("config")
databases.remove("local")
databases.remove("ps")      #file too large, cause rendering slow
databases.remove("ST_NO")
databases.remove("tags")

tag_db = client['tags']
tag_col = tag_db["tags"]
print(tag_db)
all_layer = []
for db in databases:
    tempDB = client[db]
    tempCollection = tempDB.list_collection_names()
    is_time_series = False
    res_json = []
    
    for col in tempCollection:
        results = {}
        all_layer.append(col)
        if(db == "yunlin"):
            if(col.startswith("time_series_")):
                results = {
                    "name" : col,
                    "tag" : ["雲林","時序"]
                }
            else:
                results = {
                    "name" : col,
                    "tag" : ["雲林","非時序"]
                }
        elif(db == "changhua"):
            if(col.startswith("time_series_")):
                results = {
                    "name" : col,
                    "tag" : ["彰化","時序"]
                }
            else:
                results = {
                    "name" : col,
                    "tag" : ["彰化","非時序"]
                }
        elif(db == "GPS"):
            results = {
                    "name" : col,
                    "tag" : ["GPS","非時序"]
            }
        elif(db == "Geology"):
            results = {
                    "name" : col,
                    "tag" : ["地質","非時序"]
            }
        tag_col.insert_one(results)
