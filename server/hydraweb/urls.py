from django.urls import path,include
from .views import LayerAPIView, LayerListAPIView, WaterLevelAllStationAPI,WaterLevelAPI,PDFAndPngAPI,TagsAPI,AllTagsAPI
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/layer', LayerListAPIView.as_view(), name="layer"),
    path('user/water_level/stations', WaterLevelAllStationAPI.as_view(), name="stations"),
    path('user/water_level/getByID', WaterLevelAPI.as_view(), name="getByID"),
    path('user/img', PDFAndPngAPI.as_view(), name="img"),
    path('user/all_tag', AllTagsAPI.as_view(), name="tags"),
    path('user/tagAndGIS', TagsAPI.as_view(), name="tagAndGIS"),
]