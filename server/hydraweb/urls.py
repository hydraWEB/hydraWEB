from django.urls import path,include
from .views import LayerAPIView, LayerListAPIView, WaterLevelAllStationAPI,WaterLevelAPI
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/layer', LayerAPIView.as_view(), name="layer"),
    path('user/water_level/stations', WaterLevelAllStationAPI.as_view(), name="stations"),
    path('user/water_level/getByID', WaterLevelAPI.as_view(), name="getByID"),
]