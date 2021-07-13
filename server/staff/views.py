from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes

from .models import Announcement, SystemLog, SystemOperationEnum
from core.utils import StandardResultsSetPagination
from rest_framework.permissions import AllowAny, IsAdminUser
from .serializers import AnnouncementSerializer, SystemLogSerialzer
from rest_framework.response import Response


# Create your views here.

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAdminUser,)

    def create(self, request):
        serializer = AnnouncementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)


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
                queryset = queryset.get_log_by_year_and_month(year=year, month=month)
            else:
                queryset = queryset.get_log_by_year(year=year)

        if type is not None:
            if isinstance(type, str):
                if type == "user_login":
                    queryset = queryset.filter(operation=SystemOperationEnum.USER_LOGIN).all()

        return queryset

    def list(self, request, **kwargs):
        queryset = self.paginate_queryset(self.get_queryset().order_by('-created_at'))
        serializer = SystemLogSerialzer(queryset, many=True)
        return self.get_paginated_response(serializer.data)
