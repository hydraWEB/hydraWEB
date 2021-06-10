from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from authentication.models import User
from .serializers import RegisterSerializer,MyTokenObtainPairSerializer,ResetPasswordSerializer
from django_rest_passwordreset.views import ResetPasswordConfirm

class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

class ResetPasswordView(ResetPasswordConfirm):
    permission_classes = (AllowAny,)
    serializer_class = ResetPasswordSerializer
  
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer