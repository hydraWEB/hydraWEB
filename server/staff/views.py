from django.db.models import query
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes

from authentication.models import User
from .models import Announcement, SystemLog, SystemOperationEnum, IpSetting, SystemSetting
from core.utils import StandardResultsSetPagination
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from .serializers import SystemLogSerialzer, StaffAnnouncementSerializer, UserAnnouncementSerializer, UserSerializer, IPManageSerializer,AdminUserSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# Create your views here.


class StaffAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAdminUser,)
    serializer_class = StaffAnnouncementSerializer

    def get_queryset(self):
        return self.queryset

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(self.get_queryset())
        serializer = StaffAnnouncementSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)

    def retrive(self, request, pk=None, **kwargs):
        a = get_object_or_404(Announcement, pk=pk)
        serializer = StaffAnnouncementSerializer(data=a)
        serializer.is_valid(raise_exception=True)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = StaffAnnouncementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.create(request.user)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)

    def patch(self, request, pk=None, **kwargs):
        a = get_object_or_404(Announcement, pk=pk)
        serializer = StaffAnnouncementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.edit(user=request.user, instance=a)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)

    def destory(self, request, pk=None, **kwargs):
        a = get_object_or_404(Announcement, pk=pk)
        serializer = StaffAnnouncementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.delete(user=request.user, instance=a)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)


class UserAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(self.get_queryset())
        serializer = UserAnnouncementSerializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_years(request):
    return Response({"status": "ok", "data": SystemLog.objects.get_all_years()}, status=status.HTTP_200_OK)


class SystemLogViewSet(viewsets.ModelViewSet):
    queryset = SystemLog.objects
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAdminUser,)

    def get_queryset(self):
        queryset = self.queryset
        type = self.request.query_params.get('type', None)
        year = self.request.query_params.get('year', None)
        month = self.request.query_params.get('month', None)

        if year is not None:
            if month is not None:
                queryset = queryset.get_log_by_year_and_month(
                    year=year, month=month)
            else:
                queryset = queryset.get_log_by_year(year=year)

        if type is not None:
            if isinstance(type, str):
                if type == "user_login":
                    queryset = queryset.filter(
                        operation=SystemOperationEnum.USER_LOGIN).all()

        return queryset

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(
            self.get_queryset().order_by('-created_at'))
        serializer = SystemLogSerialzer(queryset, many=True)
        return self.get_paginated_response(serializer.data)


class AccountViewSet(viewsets.ModelViewSet):
    queryset = User.objects
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAdminUser,)

    serializer_class = AdminUserSerializer

    def get_queryset(self):
        queryset = self.queryset
        userid = self.request.query_params.get('userid', None)
        username = self.request.query_params.get('username', None)
        email = self.request.query_params.get('email', None)

        if userid is not None:
            queryset = queryset.filter(userid=userid)

        if username is not None:
            queryset = queryset.filter(username=username)

        if email is not None:
            queryset = queryset.filter(email=email)

        return queryset

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(
            self.get_queryset().order_by('-created_at'))
        serializer = AdminUserSerializer(queryset, many=True)
        
        return self.get_paginated_response(serializer.data)

    def retrive(self, request, pk=None, **kwargs):
        a = get_object_or_404(User, pk=pk)
        serializer = AdminUserSerializer(data=a)
        serializer.is_valid(raise_exception=True)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)

    def patch(self, request, pk=None, **kwargs):
        a = get_object_or_404(User, pk=pk)
        serializer = AdminUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.edit(user=request.user, instance=a)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)

    def destory(self, request, pk=None, **kwargs):
        a = get_object_or_404(User, pk=pk)
        serializer = AdminUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.delete(user=request.user, instance=a)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)



class IPManageViewSet(viewsets.ModelViewSet):
    queryset = IpSetting.objects
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAdminUser,)

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(
        self.queryset.order_by('-created_at'))

    def create(self, request):
        serializer = IPManageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.create(request.user)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)

    def destory(self, request, pk=None, **kwargs):
        a = get_object_or_404(IpSetting, pk=pk)
        serializer = IPManageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.delete(user=request.user,instance=a)
        pass

class SystemSettingViewSet(viewsets.ModelViewSet):
    queryset = SystemSetting.objects
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAdminUser,)
    def get_queryset(self):
        return self.queryset

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(
        self.queryset.order_by('-created_at'))

    def patch(self, request, pk=None, **kwargs):
        a = get_object_or_404(SystemSetting)
        serializer = SystemSettingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.edit(instance=a)
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)