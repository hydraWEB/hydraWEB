import influxdb_client
import json
import datetime

token = "IGFIcuExdgqGPVxjtBDo2hUpoeh7r7FXGO-hMrSRd4U0EwB9A2F2Cp2yUf2NvIk2Ndm7UN4tYFvUMHvXkiwLQg=="
org = "hydraweb"
bucket = "hydraweb"
url="http://localhost:8086"

client = influxdb_client.InfluxDBClient(
   url=url,
   token=token,
   org=org
)

query_api = client.query_api()
query = 'from (bucket:"hydraweb")\
|> range(start: 1970-01-01T00:00:00Z)\
|> filter(fn: (r) => r["_value"] == "Yunlin")'
ylresult = query_api.query(query=query, org = org)
feature = []


for table in ylresult:
    for record in table.records:
        ##record.values is a dict 
        properties = {}
        geometry = {
            "type" : "Point"
        }
        newKey = []
        coordinates = [0,0] 
        newValue = []
        for key in record.values:
            newKey.append(key)
            newValue.append(record.values[key])
        for i in range(4, len(record.values)):
            if(newKey[i] != "lat" and newKey[i] != "lon" and newKey[i] != "_field" and newKey[i] != "_time"):
                properties[newKey[i]] = newValue[i]
            elif(newKey[i] == "_time"):
                properties[newKey[i]] = newValue[i].isoformat()
            elif(newKey[i] == "lon"):
                coordinates[0] = float(newValue[i])
            elif(newKey[i] == "lat"):
                coordinates[1] = float(newValue[i])
        geometry["coordinates"] = coordinates
        ft = {
            "type" : "Feature",
            "geometry" : geometry,
            "properties" : properties
        }
        feature.append(ft)
geojson = {
    "type": "FeatureCollection",
    "features": feature
}
with open("C:/Users/Leong/Desktop/hydrawebInflux/newdata/geojson.json", 'w') as outfile:
    json.dump(geojson, outfile)
