from rest_framework import serializers
from .models import Announcement, SystemLog


class AnnouncementSerializer(serializers.ModelSerializer):
    title = serializers.CharField(allow_null=False)
    content = serializers.CharField(allow_null=False)

    def save(self,user):
      pass

    class Meta:
        model = Announcement
        fields = ['userid', 'username', 'email', 'avatar','phone','is_staff']
        read_only_fields = ['userid', 'username', 'email', 'avatar','phone','is_staff']

class UerSerializer(serializers.Serializer):
    userid = serializers.IntegerField()
    username = serializers.CharField(max_length=255)
    email = serializers.CharField(max_length=255)
    avatar = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=255)

class SystemLogSerialzer(serializers.ModelSerializer):
    user = UerSerializer()

    class Meta:
        model = SystemLog
        fields = ['id', 'user', 'operation','created_at','updated_at']
