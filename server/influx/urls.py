from django.urls import path,include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from influx.views import MapAPIView


urlpatterns = [
    path('user/maps', MapAPIView.as_view(), name="maps"),
]