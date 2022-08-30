# 濁水溪沖積扇水文與地層下陷監測展示平台

## .env
  1. 下載influxdb2.0並建立organizaiton和建立token
  2. 建立MYSQL資料庫
  3. 複製.env.enample檔命名成.env檔並填入自己的influxdb資料和MYSQL資料

## 建立MongoDB資料庫
  1. 下載[雲端硬碟](https://drive.google.com/drive/folders/1sXM7NQU-Hob5yAZJEGWv2PFAffOhMdpa)的資料
  2. 使用```python/layer_data_to_mongo```來建立圖層資料

## 建立Influx資料庫
  1. 下載[雲端硬碟](https://drive.google.com/drive/folders/1J4cKrxF6lQ4gm5h9bOlsseLJscmh8OOh)的資料
  3. 使用```python/getAll_ST_NO_toMongoDB```建立所有水位站點的mongodb索引資料
  4. 使用```python/JsonToInfluxdb_v4(groundwater)```建立influxdb的資料


## client

1. ```cd client```
2. ```npm install```
3. ```npm start```


## server

1. ```cd server```
2. ```pipenv install```
3. ```python3 manage.py runserver```

## 如果地圖無法顯示

1. npm unistall react-scripts
2. npm install --save react-scripts@4.0.3
