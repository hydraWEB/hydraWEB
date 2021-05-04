import csv
import json
from collections import OrderedDict

li = []
with open('C://Users//User//Documents//GitHub//HydraWeb//client//src//utils//testcrash.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for lat,log,name in reader:
        d = OrderedDict()
        d['type'] = 'Feature'
        if lat == "" or lat == None or not lat or lat=="lat":
          lat = "0.0"
        if log == "" or log == None or not log or log=="log":
          log = "0.0"
        print(lat)
        d['geometry'] = {
            'type': 'Point',
            'coordinates': [float(lat), float(log)]
        }
        li.append(d)

d = OrderedDict()
d['type'] = 'FeatureCollection'
d['features'] = li
with open('GeoObs.json', 'w') as f:
    f.write(json.dumps(d, sort_keys=False, indent=4))