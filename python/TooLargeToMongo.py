import os 
import pymongo
import json

#改成自己的
layer_data_dir = 'C:/Users/Leong/Downloads/New folder'
db_name = 'yunlin'


client = pymongo.MongoClient('mongodb://localhost:27017')
db = client[db_name] 

all_dir = os.listdir(layer_data_dir) 

result = []
col = db["雲林_坐標_深度_電量"]
for dir in all_dir:
  if(dir == "yunlin"):
    file_list = os.listdir(f"{layer_data_dir}/{dir}")
    for file in file_list:
      print(file)
      if file.endswith(".json"):
        f = open(f'{layer_data_dir}/{dir}/{file}',"r",encoding="utf-8")
        json_data = json.load(f)
        for dt in json_data["features"]:
            results = {}
            results["x"] = dt["geometry"]["coordinates"][0]
            results["y"] = dt["geometry"]["coordinates"][1]
            results["W_TUBE_DEP"] = dt["properties"]["W_TUBE_DEP"]
            col.insert_one(results)
      
client.close()