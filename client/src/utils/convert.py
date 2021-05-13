import csv
import json
from collections import OrderedDict
import random

li = []
lat = 0
log = 0
for i in range(0,1000):
  d = OrderedDict() 
  d['type'] = 'Feature' 
  d['geometry'] = {
      'type': 'Point',
      'coordinates': [float(log),float(lat)]
  }
  li.append(d)
  lat = random.uniform(21.88, 25.3)	
  log = random.uniform(120,122)	
  print(f"{i}")

d = OrderedDict()
d['type'] = 'FeatureCollection'
d['features'] = li
with open('GeoObs1000.json', 'w') as f:
    f.write(json.dumps(d, sort_keys=False, indent=4))
