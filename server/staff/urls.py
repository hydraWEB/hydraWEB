from django.urls import path,include
from rest_framework_simplejwt.views import TokenRefreshView
from staff.views import SystemLogViewSet, get_all_years
from rest_framework.routers import DefaultRouter

routerStaff = DefaultRouter()
routerStaff.register('system-log', SystemLogViewSet, basename='system_log')


urlpatterns = [
    path('staff/system-log/get-all-years', get_all_years),
    path('staff/', include(routerStaff.urls))
]