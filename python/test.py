import pymongo
import pandas as pd

df = pd.read_json(r'C:\Users\Leong\Desktop\專題\3d_test2.json')
df.to_csv(r'C:\Users\Leong\Desktop\專題\newCsv.csv', index = None)