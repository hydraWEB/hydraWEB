from django.urls import path,include
from .views import LayerAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/layer', LayerAPIView.as_view(), name="layer"),
    path('user/layer/list', LayerAPIView.as_view(), name="layer"),
]