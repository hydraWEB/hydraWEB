import json
import os

path = "C:/Users/Leong/Downloads/地質鑽探資料-20210824T112337Z-001/地質鑽探資料"
resultpath = "C:/Users/Leong/HydraWeb2/HydraWeb/python/result"
length = 0
resultArr = []
result = {}
toCompare = '高速鐵路第六標雲林至喜義段地質調查高速鐵路第六標雲林至喜義段地質'
for filename in os.listdir(path):
    with open(os.path.join(path, filename), 'r',encoding="utf-8") as f:
        data = json.load(f)
        jsdt = {}
        feature = data['features']
        jsdt['features'] = feature
        

        
          
          #result[feature['properties']['prop1']['計畫名稱']] = feature
        break
    break
