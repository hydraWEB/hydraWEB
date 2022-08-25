from django.urls import path,include
from .views import (LayerListAPIView, WaterLevelAllStationAPI,PDFAndPngAPI,
                    TagsAPI,AllTagsAPI,WaterLevelDownloadAPI,UploadFileAPI,UploadAndConvertToCSVFileAPI, 
                    UploadAndConvertToJSONFileAPI, UploadAndConvertToGEOJSONFileAPI, UploadAndConvertToSHPFileAPI,
                    DownloadFileListAPI, DownloadFileAPI, GnssFunction, DownloadMapDataAPI, Choushui_editLineLayerListAPIView,
                    GNSSListAPIView, UploadGNSSAPI, PartLayerListAPIView)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/layer', LayerListAPIView.as_view(), name="layer"),
    path('user/water_level/stations', WaterLevelAllStationAPI.as_view(), name="stations"),
    path('user/water_level/download', WaterLevelDownloadAPI.as_view(), name="download"),    
    path('user/img', PDFAndPngAPI.as_view(), name="img"),
    path('user/all_tag', AllTagsAPI.as_view(), name="tags"),
    path('user/tagAndGIS', TagsAPI.as_view(), name="tagAndGIS"),
    path('user/uploadFile/original', UploadFileAPI.as_view(), name="uploadFileOriginal"),
    path('user/uploadFile/convertCSV', UploadAndConvertToCSVFileAPI.as_view(), name="uploadFileCSV"),
    path('user/uploadFile/convertJSON', UploadAndConvertToJSONFileAPI.as_view(), name="uploadFileJSON"),
    path('user/uploadFile/convertGEOJSON', UploadAndConvertToGEOJSONFileAPI.as_view(), name="uploadFileGEOJSON"),
    path('user/uploadFile/convertSHP', UploadAndConvertToSHPFileAPI.as_view(), name="uploadFileSHP"),
    path('user/DownloadFileList', DownloadFileListAPI.as_view(), name="downloadFileList"),
    path('user/downloadFile', DownloadFileAPI.as_view(), name="downloadFile"),
    path('user/downloadMapData', DownloadMapDataAPI.as_view(), name="downloadMapData"),
    path('user/GnssFunction', GnssFunction.as_view(), name="gnssFunction"),
    path('user/choushuiEditLayer', Choushui_editLineLayerListAPIView.as_view(), name="choushuiEditLayer"),
    path('user/GNSSList', GNSSListAPIView.as_view(), name="GNSSList"),
    path('user/uploadGNSS', UploadGNSSAPI.as_view(), name="uploadGNSS"),
    path('user/partLayer', PartLayerListAPIView.as_view(), name="partLayer")
]
