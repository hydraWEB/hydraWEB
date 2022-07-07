
import json 
import os
import pysftp
import sys
import csv
import paramiko
import pymongo
import argparse
import geopandas as gpd
from osgeo import ogr, gdal

def GeojsonToShp2(filename, read_location, write_location): #using geopandas
    print("geopandas")
    fname=filename+".json"
    dir_path = os.path.join(read_location,"{}").format(str(fname))
    
    write_dir = os.path.join(write_location,filename+".shp")
    gdf = gpd.read_file(dir_path, encoding="utf-8")
    gdf.to_file(write_dir, encoding="utf-8")