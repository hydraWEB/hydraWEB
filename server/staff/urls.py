from django.urls import path,include
from rest_framework_simplejwt.views import TokenRefreshView
from staff.views import SystemLogViewSet, get_all_years
from rest_framework.routers import DefaultRouter
from staff.views import StaffAnnouncementViewSet,UserAnnouncementViewSet,AccountViewSet,SystemSettingViewSet,IPManageViewSet

routerUser = DefaultRouter()
routerUser.register('announcement', UserAnnouncementViewSet, basename='bots')

routerStaff = DefaultRouter()
routerStaff.register('system-log', SystemLogViewSet, basename='system_log')
routerStaff.register('announcement', StaffAnnouncementViewSet, basename='bots')
routerStaff.register('account', AccountViewSet, basename='account')
routerStaff.register('system-updating', SystemSettingViewSet, basename='system_updating')
routerStaff.register('ip', IPManageViewSet, basename='ip')

urlpatterns = [
    path('staff/system-log/get-all-years', get_all_years),
    path('staff/', include(routerStaff.urls)),
    path('user/', include(routerUser.urls))
]