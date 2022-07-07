import geopandas as gpd
import shapely.geometry
import json
import twd97
from geojson import Feature, Point, FeatureCollection, LineString, Polygon
import os
import pysftp
import sys
import csv
import paramiko
import pymongo
import argparse

def ShpToGeojson(fileName, read_location, write_location):

    def get_parser():
        parser = argparse.ArgumentParser(description='my description')
        parser.add_argument('username', type=str)
        return parser

    def insert_point_mongo(point_file, file):
        db_name = 'shp_point'
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client[db_name]
        for i in range(0,len(file)):
            col = db['{}'.format(point_file[i])]
            with open('{}'.format(file[i]),"r",encoding="utf-8") as jsonfile:
                data = json.load(jsonfile)
                for dt in data['features']:
                    results={}
                    if str(dt["geometry"]["coordinates"][0])!='' and str(dt["geometry"]["coordinates"][0])!='':
                        results["x"] = dt["geometry"]["coordinates"][0]
                        results["y"] = dt["geometry"]["coordinates"][1]
                        results['time_series'] = 'false'
                        results["geometry"] = dt["geometry"]["type"]
                        prop = dt["properties"]
                        results.update(prop)
                        col.insert_one(results)

    def insert_polygon_mongo(polygon_file, file1):
        db_name = 'shp_polygon'
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client[db_name]
        for i in range(0,len(file1)):
            col = db['{}'.format(polygon_file[i])]
            with open('{}'.format(file1[i]),"r",encoding="utf-8") as jsonfile:
                data = json.load(jsonfile)
        
                for dt in data['features']:
                    results={}
                    if dt["geometry"]!=0:
                        results["coordinates"] = dt["geometry"]["coordinates"][0]
                        results['time_series'] = 'false'
                        results["geometry"] = dt["geometry"]["type"]
                        prop = dt["properties"]
                        results.update(prop)   
                        col.insert_one(results)
                        

    record=[]
    cnopts = pysftp.CnOpts()
    cnopts.hostkeys = None
    file = []

    shp=[] 
    name=[]
    dict1=[]
    
    temp=[]
    file=[]
    point_file=[]
    polygon_file=[]
    file1=[]
    total_file=[]
    total_name=[]
    dir_path = os.path.join(read_location,fileName)
    gdf_Rail=gpd.read_file('{}'.format(dir_path),decoding='utf-8')

    geojson = {
        'type': 'FeatureCollection',
        'features': []
    }
    counter=len(gdf_Rail)
    temp=list(gdf_Rail)
    point=0
    polygon=0
    for i in range(0,counter):
        record={}
        my_point=0
        counter=0
        for y in range(0,len(temp)):
            if str(temp[y])=='geometry':
                if gdf_Rail.iloc[i]['{}'.format(temp[y])]!=None:
                    if str(gdf_Rail.iloc[i]['{}'.format(temp[y])].geom_type)==str('Point'):
                        point=1
                        l_temp=gdf_Rail.iloc[i]['{}'.format(temp[y])]
                        
                        temp1, temp2 = float(l_temp.x), float(l_temp.y)
                        if temp1>180 and temp2>90: 
                            temp1, temp2 = twd97.towgs84(temp1, temp2)
                            my_point = Point((float(temp2), float(temp1)))
                        else:
                            my_point = Point((float(temp1), float(temp2)))
                    elif str(gdf_Rail.iloc[i]['{}'.format(temp[y])].geom_type)==str('Polygon'):
                        polygon=1
                        temp1=gdf_Rail.iloc[i]['geometry']
                        map1=shapely.geometry.mapping(temp1)
                        poly=[]
                        full_poly=[]
                        for i in range(0,len(map1['coordinates'][0])):

                            temp1, temp2 = map1['coordinates'][0][i][0], map1['coordinates'][0][i][1]
                            TW_X, TW_Y = twd97.towgs84(temp1, temp2)
                            p_temp=[]
                            p_temp.append(TW_Y)
                            p_temp.append(TW_X)
                            poly.append(tuple(p_temp))
                        full_poly.append(poly)
                        my_point = Polygon(full_poly)
                else:
                    counter=1
            else:
                record['{}'.format(temp[y])]=str(gdf_Rail.iloc[i]['{}'.format(temp[y])])
                data=str(gdf_Rail.iloc[i]['{}'.format(temp[y])])
                data1=data.encode('utf-8')
                data2=data1.decode('utf-8')
                #print(data2)
    
        if counter==0:
            geojson['features'].append({
                'type': 'Feature',
                'geometry': my_point,
                'properties': record,
            })
    fname = fileName.replace(".shp", "")
    fname = fname.replace(".shx", "")
    fname = fname.replace(".dbf", "")
    with open('{}/{}.json'.format(write_location,fname), 'w', encoding='UTF-8') as jsonf: 
        jsonString = json.dumps(geojson, ensure_ascii=False,indent=4)
        jsonf.write(jsonString)
    if point==1:
        file_temp='{}/{}.json'.format(write_location,fname)
        point_file.append(fname)
        file.append(file_temp)
        total_name.append(fname)
        total_file.append(file_temp)
    elif polygon==1:
        file_temp='{}/{}.json'.format(write_location,fname)
        polygon_file.append(fname)
        file1.append(file_temp)
        total_name.append(fname)
        total_file.append(file_temp)   
    """ header=['file_path','file_name']
    with open('/root/data_storage/{}/file_record.csv'.format(args.username), 'w',encoding="UTF-8") as out_file:
        writer = csv.writer(out_file)
        writer.writerow(header)
        for i in range(0,len(total_file)):
            writer.writerow([total_file[i],total_name[i]])
    if len(point_file)>0:
        insert_point_mongo(point_file, file)
    if len(polygon_file)>0:
        insert_polygon_mongo(polygon_file, file1)
        print("insert") """
        
ShpToGeojson("test.shp", "/var/www/html/app-deploy/HydraWeb/python", "/var/www/html/app-deploy/HydraWeb/python")