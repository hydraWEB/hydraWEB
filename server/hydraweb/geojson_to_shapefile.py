import json 
import os
import pysftp
import sys
import csv
import paramiko
import pymongo
import argparse
from osgeo import ogr, gdal

def GeojsonToShp(filename, read_location, write_location):
    
    def get_parser():
        parser = argparse.ArgumentParser(description='my description')
        parser.add_argument('username', type=str)
        return parser

    def create_polygon(coords):
        ring = ogr.Geometry(ogr.wkbLinearRing)
        for coord in coords:
            for xy in coord:
                ring.AddPoint(xy[0],xy[1])
                poly = ogr.Geometry(ogr.wkbPolygon)
                poly.AddGeometry(ring)
        return poly.ExportToIsoWkt()

    def create_shp_with_geojson(json,geo_type,dict1,name,encode):
        gdal.SetConfigOption("GDAL_FILENAME_IS_{}".format(encode), "YES")
        gdal.SetConfigOption("SHAPE_ENCODING", "{}".format(encode))
        driver = ogr.GetDriverByName("ESRI Shapefile")
        properties_temp=list(json['features'][0]['properties'])
        
        if geo_type=='Polygon' or geo_type=='MultiPolygon':
            polygon_data_source = driver.CreateDataSource("{}/{}.shp".format(str(dict1),str(name)))
            polygon_layer = polygon_data_source.CreateLayer("{}".format(str(name)), geom_type=ogr.wkbPolygon)
            for i in range(0,len(properties_temp)):
                field_testfield = ogr.FieldDefn("{}".format(str(properties_temp[i])), ogr.OFTString)
                field_testfield.SetWidth(254)
                polygon_layer.CreateField(field_testfield)
        elif geo_type=='Point': #建立shapefile的檔案名稱,屬性表格格式
            point_data_source = driver.CreateDataSource("{}/{}.shp".format(str(dict1),str(name)))
            point_layer = point_data_source.CreateLayer("{}".format(str(name)), geom_type=ogr.wkbPoint) #layer 屬性
            for i in range(0,len(properties_temp)):
                field_testfield = ogr.FieldDefn("{}".format(str(properties_temp[i])), ogr.OFTString)
                field_testfield.SetWidth(254)
                point_layer.CreateField(field_testfield) #加入屬性
        elif geo_type == 'LineString':
            polyline_data_source = driver.CreateDataSource("{}/{}.shp".format(str(dict1),str(name)))
            polyline_layer = polyline_data_source.CreateLayer("{}".format(str(name)), geom_type=ogr.wkbLineString)
            for i in range(0,len(properties_temp)):
                field_testfield = ogr.FieldDefn("{}".format(str(properties_temp[i])), ogr.OFTString)
                field_testfield.SetWidth(254)
                polyline_layer.CreateField(field_testfield)
                
        for record in json['features']:
            geo = record.get("geometry")
            geo_type = geo.get('type')
            #print(geo)
            temp=list(record['properties'])
            
            if geo_type == 'Polygon':
                
                polygonCOOR = geo.get('coordinates')
                poly = create_polygon(polygonCOOR)
                if poly:
                    feature = ogr.Feature(polygon_layer.GetLayerDefn())
                    for i in range(0,len(temp)):
                        if str(record['properties']["{}".format(str(temp[i]))])=="":
                            feature.SetField("{}".format(str(temp[i])), "NULL")
                        else:
                            data=str(record['properties']["{}".format(str(temp[i]))])
                            data1=data.encode('utf-8')
                            data2=data1.decode('utf-8')
                            feature.SetField("{}".format(str(temp[i])), data2)
                    area = ogr.CreateGeometryFromWkt(poly)
                    polygon_layer.CreateFeature(feature)
                    feature = None
            elif geo_type == 'MultiPolygon':
                
                feature = ogr.Feature(polygon_layer.GetLayerDefn())
                for i in range(0,len(temp)):
                    if str(record['properties']["{}".format(str(temp[i]))])=="":
                        feature.SetField("{}".format(str(temp[i])), "NULL")
                    else:
                        data=str(record['properties']["{}".format(str(temp[i]))])
                        data1=data.encode('utf-8')
                        data2=data1.decode('utf-8')
                        feature.SetField("{}".format(str(temp[i])), data2)
                
                gjson = ogr.CreateGeometryFromJson(str(geo))
                if gjson:
                    feature.SetGeometry(gjson)
                    polygon_layer.CreateFeature(feature)
                    feature = None
            elif geo_type == 'Point':
                
                feature = ogr.Feature(point_layer.GetLayerDefn())
                for i in range(0,len(temp)):
                    if str(record['properties']["{}".format(str(temp[i]))])=="":
                        feature.SetField("{}".format(str(temp[i])), "NULL")
                    else:
                        data=str(record['properties']["{}".format(str(temp[i]))])
                        data1=data.encode('utf-8')
                        data2=data1.decode('utf-8')
                        feature.SetField("{}".format(str(temp[i])), data2)
                
                point_geo = ogr.CreateGeometryFromJson(str(geo))
                if point_geo:
                    feature.SetGeometry(point_geo)
                    point_layer.CreateFeature(feature)
                    feature = None
                    
            elif geo_type == 'LineString':
                
                feature = ogr.Feature(polyline_layer.GetLayerDefn())
                for i in range(0,len(temp)):
                    if str(record['properties']["{}".format(str(temp[i]))])=="":
                        feature.SetField("{}".format(str(temp[i])), "NULL")
                    else:
                        data=str(record['properties']["{}".format(str(temp[i]))])
                        data1=data.encode('utf-8')
                        data2=data1.decode('utf-8')
                        feature.SetField("{}".format(str(temp[i])), data2)
                
                line_geo = ogr.CreateGeometryFromJson(str(geo))
                if point_geo:
                    feature.SetGeometry(line_geo)
                    polyline_layer.CreateFeature(feature)
                    feature = None
            else:
                print('Could not discern geometry')
    

    record=[]
    parser = get_parser()
    cnopts = pysftp.CnOpts()
    cnopts.hostkeys = None
    file = []
    dir_path = os.path.join(read_location,"{}").format(str(filename))
    filename=filename+".json"
    encode="UTF-8"
    with open(os.path.join(read_location,filename), "r", encoding='utf-8') as read:
        try:
            readline = read.readlines()
        except:
            encode="BIG5"
            read.close()
    with open(os.path.join(read_location,filename), "r", encoding='{}'.format(str(encode))) as jsonfile:
        print(encode)
        data = json.load(jsonfile)
        geo_type=str(data['features'][0]['geometry']['type'])
        fname = filename.replace(".json", "")
        create_shp_with_geojson(data,geo_type,write_location,fname, encode)
"""         new_dict=[]
        new_name=[]
        temp_conf=['shp','shx','dbf']
        for i in range(0,len(dict1)):
            temp=dict1[i]['content']
            temp=temp+str(name[i])
            for y in range(0,len(temp_conf)):
                temp1=temp
                temp1=temp1+'.'
                temp1=temp1+str(temp_conf[y])
                new_dict.append(temp1)
                nt=name[i]
                nt=nt+'.'
                nt=nt+str(temp_conf[y])
                new_name.append(nt)
        header=['file_path','file_name']
        with open('/root/data_storage/{}/file_record.csv'.format(args.username), 'w',encoding="UTF-8") as out_file:
            writer = csv.writer(out_file)
            writer.writerow(header)
            for i in range(0,len(new_dict)):
                writer.writerow([new_dict[i],new_name[i]]) """
                
