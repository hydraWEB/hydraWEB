from django.urls import path,include
from .views import LayerAPIView, LayerListAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/layer', LayerListAPIView.as_view(), name="layer"),
    path('user/layer/list', LayerListAPIView.as_view(), name="layer1"),
]