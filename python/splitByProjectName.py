import json
import os

path = "C:/Users/Leong/Downloads/地質鑽探資料-20210824T112337Z-001/地質鑽探資料"
resultpath = "C:/Users/Leong/HydraWeb2/HydraWeb/python/result"

resultArr = []
result = {}
isFirstTime = True
isFinish = False

findAllPrjName = []
removeDupPrjName = []
for filename in os.listdir(path):
    with open(os.path.join(path, filename), 'r',encoding="utf-8") as f:
      data = json.load(f)
      for features in data['features']:
        findAllPrjName.append(features['properties']['prop1']['計畫名稱'])

[removeDupPrjName.append(x) for x in findAllPrjName if x not in removeDupPrjName]
removeDupPrjName[2] = 'THSR_C270_stage_2(2)'
removeDupPrjName[9] = 'THSR_C270_stage_1(2)'
for toCompare in removeDupPrjName:
  for filename in os.listdir(path):
      with open(os.path.join(path, filename), 'r',encoding="utf-8") as f:
        data = json.load(f)
        newJsonData = {}
        for features in data['features']:
          prjName = features['properties']['prop1']['計畫名稱']
          if(prjName == toCompare):
            for ft in features:
              newJsonData[ft] = features[ft]
            resultArr.append(newJsonData)
          
  resultGeojson = {
    'type': "FeatureCollection",
    "features" : resultArr
  }
  resultFileName = toCompare + ".json"
  with open(os.path.join(resultpath, resultFileName), 'w',encoding="utf-8") as out_file:
    json.dump(resultGeojson, out_file ,indent=4, ensure_ascii=False)

""" for arr in resultArr:
  print(arr)
  print('\n')
 """
        
