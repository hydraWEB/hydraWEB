from rest_framework import serializers
from .models import Announcement, SystemLog, IpSetting, SystemSetting,SystemOperationCh
from django.contrib.auth.password_validation import validate_password 
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
    
    def edit(self,instance, user):
        instance.edit_user(
            username=self.validated_data['username'],
            avatar=self.validated_data['avatar'],
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
    operation = serializers.SerializerMethodField('get_operation')

    class Meta:
        model = SystemLog
        fields = ['id', 'user', 'operation','created_at','updated_at']

    def get_operation(self,obj):
        return SystemOperationCh[obj.operation]


class IPManageSerializer(serializers.ModelSerializer):
    ip_address = serializers.CharField(allow_null=False, max_length=150)
    user = AuthUserSerializer(read_only=True)
    
    def create(self,user):
        IpSetting.objects.create_black_list(ip_address = self.validated_data['ip_address'],user=user)

    def delete(self, user, instance, ip_address):
        instance.delete_black_list()

    class Meta:
        model = IpSetting
        fields = ['id','ip_address', 'user']


class SystemSettingSerializer(serializers.ModelSerializer):
    currentMode = serializers.IntegerField(read_only=True)

    def edit(self, instance):
        instance.edit_mode(currentMode = self.validated_data['currentMode'])

    class Meta:
        model = SystemSetting
        fields = ['id','currentMode']
        
class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['old_password', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        request = self.context.get("request")
        mail = request.data["email"]
        
        user = User.objects.get(email = mail)
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return value
    

    def update(self, instance, validated_data):
        user = self.context['request'].user

        instance.set_password(validated_data['password'])
        instance.save()

        return instance