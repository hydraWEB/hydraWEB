from rest_framework import serializers
from .models import Announcement

class AnnouncementSerializer(serializers.ModelSerializer):
    title = serializers.CharField(allow_null=False)
    content = serializers.CharField(allow_null=False)

    def save(self,user):
      

    class Meta:
        model = Announcement
        fields = ['userid', 'username', 'email', 'avatar','phone','is_staff']
        read_only_fields = ['userid', 'username', 'email', 'avatar','phone','is_staff']