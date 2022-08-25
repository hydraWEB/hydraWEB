import geopandas as gpd
import shapely.geometry
import json
import twd97
from geojson import Feature, Point, FeatureCollection, LineString, Polygon
import csv
import os
import pymongo
db_name = 'changhua'
client = pymongo.MongoClient('mongodb://localhost:27017')
db = client[db_name]
file='/var/www/html/app-deploy/HydraWeb/server/map_data/changhua'
collection='水準樁_彰化縣'
col = db['{}'.format(collection)]
cur = col.find()
results = list(cur)
if len(results)!=0:
    col.delete_many({})
with open('{}'.format(file),"r",encoding="utf-8") as jsonfile:
    data = json.load(jsonfile)
    for dt in data['features']:
        results={}
        if str(dt["geometry"]["coordinates"][0])!='' and str(dt["geometry"]["coordinates"][0])!='':
            results["x"] = dt["geometry"]["coordinates"][0]
            results["y"] = dt["geometry"]["coordinates"][1]
            results['time_series'] = 'false'
            results["geometry"] = dt["geometry"]["type"]
            results["tag"]=["彰化","非時序"]
            prop = dt["properties"]
            results.update(prop)
            col.insert_one(results)