import geopandas as gpd
import shapely.geometry
import json
import twd97
from geojson import Feature, Point, FeatureCollection, LineString, Polygon
import csv
import os
import pymongo
from datetime import datetime
entries = os.listdir('/var/www/html/app-deploy/HydraWeb/server/Map_data_part')
org=[]
entries1=[]
for i in range(0,len(entries)):
    if str(entries[i]).find("_part")>0:
        print(str(entries[i]))
        temp=str(entries[i])
        temp=temp.replace("_part","")
        org.append(str(temp))
        entries1.append(str(entries[i]))
print(entries1)
print(len(org))

for i in range(0,len(entries1)):
    read_path = os.path.join("/var/www/html/app-deploy/HydraWeb/server/Map_data_part","{}".format(str(entries1[i])))
    files=os.listdir(read_path)
    db_name = str(entries1[i])
    client = pymongo.MongoClient('mongodb://localhost:27017')
    db = client[db_name]
    for y in range(0,len(files)):
        name=files[y]
        print(name)
        name=name.replace(".json","")
        col = db['{}'.format(name)]
        cur = col.find()
        results = list(cur)
        if len(results)!=0:
            col.delete_many({})
        with open ("/var/www/html/app-deploy/HydraWeb/server/Map_data_part/{}/{}".format(str(entries1[i]),str(files[y])),"r",encoding="utf-8") as jsonfile:
            data = json.load(jsonfile)
            for d in data:
                col.insert_one(d)