  
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from staff.models import SystemLog, SystemOperationEnum
from authentication.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from datetime import timedelta

from django.core.exceptions import ValidationError
from django.http import Http404
from django.shortcuts import get_object_or_404 as _get_object_or_404
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from django_rest_passwordreset.models import get_password_reset_token_expiry_time
from django_rest_passwordreset import models
from django.contrib.auth import get_user_model

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        return token

    def validate(self, attrs):
        data = super(MyTokenObtainPairSerializer, self).validate(attrs)
        data.update({'username': self.user.username})
        data.update({'email': self.user.email})
        data.update({'is_staff': self.user.is_staff})
        SystemLog.objects.create_log(user=self.user,operation=SystemOperationEnum.USER_LOGIN)
        return data

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True,max_length=255)
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    phone = serializers.CharField(required=True,max_length=255)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_check = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password_check', 'email','phone')
        extra_kwargs = {
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_check']:
            raise serializers.ValidationError({"password_check": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_check = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_check']:
            raise serializers.ValidationError({"password_check": "Password fields didn't match."})
        token = attrs['token']

        # get token validation time
        password_reset_token_validation_time = get_password_reset_token_expiry_time()

        # find token
        try:
            reset_password_token = _get_object_or_404(models.ResetPasswordToken, key=token)
        except (TypeError, ValueError, ValidationError, Http404,
                models.ResetPasswordToken.DoesNotExist):
            raise Http404(_("The OTP password entered is not valid. Please check and try again."))

        # check expiry date
        expiry_date = reset_password_token.created_at + timedelta(
            hours=password_reset_token_validation_time)

        if timezone.now() > expiry_date:
            # delete expired token
            reset_password_token.delete()
            raise Http404(_("The token has expired"))
        return attrs


class UserSerializer(serializers.ModelSerializer):
    userid = serializers.CharField(max_length=255)
    class Meta:
        model = get_user_model()
        fields = ['userid', 'username', 'email', 'avatar','phone','is_staff']
        read_only_fields = ['userid', 'username', 'email', 'avatar','phone','is_staff']