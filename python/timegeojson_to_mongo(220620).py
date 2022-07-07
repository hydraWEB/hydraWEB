from datetime import datetime
import pymongo
import json
import os

root = '/var/www/html/app-deploy/HydraWeb/python/upload' #改成自己的路徑
FileList = os.listdir(root)
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["changhua"]
def isDate(val):
    format = "%Y-%m"
    try:
        return(bool(datetime.strptime(val, format)))
    except ValueError:
        return False

for file in FileList:
    
    with open(root+"/"+file,encoding="utf-8") as f:
        timeless_dict = {}
        if file.endswith(".json"):
            data = json.load(f)
            feat = data["features"]
            
            for dt in feat:
                date_arr = []
                coord = dt["geometry"]["coordinates"]
                geo = dt["geometry"]["type"]
                timeless_dict["x"] = coord[0]
                timeless_dict["y"] = coord[1]
                timeless_dict["geometry"] = geo
                timeless_dict["time_series"] = True
                for tag in dt["properties"]:
                    if not(isDate(tag)):
                        timeless_dict[tag] = dt["properties"][tag]
                    else:
                        date_arr.append({"time": tag, "Water_Level":dt["properties"][tag]})
                for d in date_arr:
                    result = {**timeless_dict, **d}
                    fname = file.replace(".json", "")
                    if(file.startswith("彰化")):
                        myclient["changhua"][fname].insert_one(result)
                    else:
                        myclient["yunlin"][fname].insert_one(result)
                    
                        
                        
  #