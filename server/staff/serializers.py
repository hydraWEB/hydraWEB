from rest_framework import serializers
from .models import Announcement, SystemLog, IpSetting
from authentication.models import User

class UserSerializer(serializers.Serializer):
    userid = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=255)
    email = serializers.CharField(max_length=255,read_only=True)
    avatar = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=255)
    created_at = serializers.DateTimeField(read_only=True)

class AdminUserSerializer(serializers.ModelSerializer):
    userid = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=255)
    email = serializers.CharField(max_length=255,read_only=True)
    avatar = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=255)
    created_at = serializers.DateTimeField(read_only=True)
    password = serializers.CharField(max_length=255,write_only=True)
    
    def edit(self,instance, user):
        instance.edit_user(
            username=self.validated_data['username'],
            avatar=self.validated_data['avatar'],
            password=self.validated_data['password'],
            phone=self.validated_data['phone'],
            user=user)

    def delete(self,instance, user):
        instance.delete_user(
            user=user)

    class Meta:
        model = User
        fields = ['userid', 'username', 'email','avatar','phone','created_at','password']


class AuthUserSerializer(serializers.Serializer):
    userid = serializers.IntegerField()
    username = serializers.CharField(max_length=255)

class StaffAnnouncementSerializer(serializers.ModelSerializer):
    title = serializers.CharField(allow_null=False, max_length=150)
    content = serializers.CharField(allow_null=False, max_length=5000)
    user = AuthUserSerializer(read_only=True)

    def create(self,user):
        Announcement.objects.create_announcement(title=self.validated_data['title'],content=self.validated_data['content'],user=user)

    def edit(self,instance, user):
        instance.edit_announcement(title=self.validated_data['title'],content=self.validated_data['content'],user=user)

    def delete(self,instance, user):
        instance.delete_announcement()

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content','user','created_at','updated_at']

class UserAnnouncementSerializer(serializers.ModelSerializer):
    title = serializers.CharField(allow_null=False, max_length=150)
    content = serializers.CharField(allow_null=False, max_length=5000)
    user = AuthUserSerializer(read_only=True)

    def save(self,user):
      pass

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content','user','created_at','updated_at']

class SystemLogSerialzer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = SystemLog
        fields = ['id', 'user', 'operation','created_at','updated_at']


class IPManageSerializer(serializers.ModelSerializer):
    ip_address = serializers.CharField(allow_null=False, max_length=150)
    user = AuthUserSerializer(read_only=True)

    def create(self,user):
        IpSetting.objects.create_black_list(ip_address = self.validated_data['ip_address'],user=user)

    def delete(self, user, instance, ip_address):
        instance.delete_black_list()

    class Meta:
        model = IpSetting
        fields = ['id','ip_address']
