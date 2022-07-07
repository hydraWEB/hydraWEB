import geopandas as gpd
import shapely.geometry
import json
import twd97
from geojson import Feature, Point, FeatureCollection, LineString, Polygon
import csv
import os
import pymongo
def insertjsonToMongo(username, filename, dir_path):
    read_path = os.path.join(dir_path,"{}").format(str(filename))
    temp=str(username)
    word_temp=""
    for i in range(0,len(temp)):
        if temp[i]!='.':
            word_temp=word_temp+temp[i]
        else:
            word_temp=word_temp+'_'
    username=word_temp
    db_name = '{}'.format(str(username))
    client = pymongo.MongoClient('mongodb://localhost:27017')
    db = client[db_name]
    fname = filename.replace(".json", "")
    col = db["{}".format(str(fname))]
    cur = col.find()
    results = list(cur)
    if len(results)!=0:
        col.delete_many({})
    with open(read_path,"r",encoding="utf-8") as jsonfile:
        data = json.load(jsonfile)
        for dt in data['features']:
            results={}
            if str(dt["geometry"]["type"])=="Point":
                if str(dt["geometry"]["coordinates"][0])!='' and str(dt["geometry"]["coordinates"][1])!='':
                    results["x"] = dt["geometry"]["coordinates"][0]
                    results["y"] = dt["geometry"]["coordinates"][1]
                    results['time_series'] = 'false'
                    results["geometry"] = dt["geometry"]["type"]
                    prop = dt["properties"]
                    results.update(prop)
                    col.insert_one(results)
            elif dt["geometry"]!=0  and str(dt["geometry"]["type"])=="Polygon":
                results["coordinates"] = dt["geometry"]["coordinates"][0]
                results['time_series'] = 'false'
                results["geometry"] = dt["geometry"]["type"]
                prop = dt["properties"]
                results.update(prop)   
                col.insert_one(results)
            elif dt["geometry"]!=0  and str(dt["geometry"]["type"])=="LineString":
                results["coordinates"] = dt["geometry"]["coordinates"]
                results['time_series'] = 'false'
                results["geometry"] = dt["geometry"]["type"]
                prop = dt["properties"]
                results.update(prop)   
                col.insert_one(results)
    map_path="/var/www/html/app-deploy/HydraWeb/server/map_data"
    map_path = os.path.join(map_path,"{}").format(str(username))
    if os.path.exists(map_path)!=True:
        os.mkdir(map_path, 777)
    os.system('cp {} {}'.format(str(read_path),str(map_path)))
    