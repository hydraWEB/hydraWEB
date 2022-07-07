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
import re

def csvTOGeojson(fileName, read_dir, write_dir):
    li = []
    read_dir_path = os.path.join(read_dir, fileName+'.csv')
    write_dir_path = os.path.join(write_dir, fileName+'.json')
    with open(read_dir_path, 'r', newline='', encoding="utf8") as csvfile:
        reader=[]
        csvReader = csv.DictReader(csvfile) 
        for row in csvReader:
            #add this python dict to json array
            reader.append(row)
        coord_location = [None] * 2
        property_key = {}
        count = 0
        features = []
        temp=list(reader[0])
        search="97"
        temp1=[]
        temp_word=[]
        for i in range(0,len(temp)):
            match=re.search(r'{}'.format(search), temp[i])
            if match!=None:
                try :
                    temp1.append(float(reader[0]['{}'.format(temp[i])]))
                    temp_word.append(str(temp[i]))
                        
                except:
                    a=0
        if temp1[0]>temp1[1]:
            temp_word1=[]
            temp_word1.append(temp_word[1])
            temp_word1.append(temp_word[0])
            temp_word=temp_word1
        geojson = {
            'type': 'FeatureCollection',
            'features': []
        }
        a=0
        for record in reader:
            if reader[a]["{}".format(str(temp_word[0]))]!="" and reader[a]["{}".format(str(temp_word[1]))]!="":
                temp1, temp2 = twd97.towgs84(float(reader[a]["{}".format(str(temp_word[0]))]),float(reader[a]["{}".format(str(temp_word[1]))]))
                my_point = Point((float(temp2), float(temp1)))
                geojson['features'].append({
                    'type': 'Feature',
                    'geometry': my_point,
                    'properties': record,
                })
            a=a+1
    with open(write_dir_path, 'w', encoding='utf8') as jsonf: 
        jsonString = json.dumps(geojson, ensure_ascii=False,indent=4)
        jsonf.write(jsonString)