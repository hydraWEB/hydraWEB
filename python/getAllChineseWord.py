import os
import json

dir = "C:/Users/Leong/Desktop/container/地下水觀測井位置圖"
files = os.listdir(dir)
allWord = []
for file in files:
    with open(dir+"/"+file, encoding="utf-8") as f:
        data = json.load(f)
        for feat in data["features"]:
            name_c = (feat['properties']["NAME_C"])
            for i in name_c:
                if(i not in allWord):
                    allWord.append(i)
                    
for i in allWord:
    print(i, end="")