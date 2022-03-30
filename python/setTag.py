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
all_layer = []
all_collection = []
for db in databases:
    tempDB = client[db]
    tempCollection = tempDB.list_collection_names()
    is_time_series = False
    res_json = []
    
    for col in tempCollection:
        all_collection.append(col)
col = 'tags'
tagsToSet = ["非時序"]
tagDB = client['tags']
tagNames = []
tagCollection = tagDB.list_collection_names()
collection = tagDB.get_collection(col)
result = collection.find()
updateData = []
for doc in result:
    tagNames.append(doc['name'])

for i in all_collection:
    if i not in tagNames:
        templist = {
            "name":i,
            "tag":tagsToSet
        }
        updateData.append(templist)

collection.insert_many(updateData)