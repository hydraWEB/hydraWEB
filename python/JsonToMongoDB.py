import os 
import pymongo
import json

#改成自己的
layer_data_dir = 'C:/Users/Leong/Downloads/drive-download-20211125T081056Z-001'
db_name = 'hydraweb'

client = pymongo.MongoClient('mongodb://localhost:27017')
db = client[db_name] 
all_dir = os.listdir(layer_data_dir) 

result = []
for dir in all_dir:
  col = db[f"{dir}"]
  file_list = os.listdir(f"{layer_data_dir}/{dir}")
  for file in file_list:
    if file.endswith(".json"):
      f = open(f'{layer_data_dir}/{dir}/{file}',"r",encoding="utf-8")
      json_data = json.load(f)
      json_data['name'] = file
      col.insert_one(json_data)
      
client.close()