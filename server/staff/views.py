from django.shortcuts import render
from rest_framework import viewsets
from .models import Announcement
from core.utils import StandardResultsSetPagination
from rest_framework.permissions import AllowAny,IsAdminUser
from .serializers import AnnouncementSerializer
# Create your views here.

class Announcement(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    pagination_class = StandardResultsSetPagination
    permission_classes = (IsAdminUser,)

    def create(self, request):
      serializer = AnnouncementSerializer(data=request.data)
      serializer.is_valid(raise_exception=True)
      serializer.save()
      return Response({"status": "ok", "data": serializer.data}, status=status.HTTP_200_OK)