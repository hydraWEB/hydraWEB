from django.shortcuts import render
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from authentication.models import User
from .serializers import RegisterSerializer,MyTokenObtainPairSerializer,ResetPasswordSerializer
from django_rest_passwordreset.views import ResetPasswordConfirm
from rest_framework import views
from rest_framework.renderers import JSONRenderer
from authentication.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status

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

class ProfileAPIView(views.APIView):
     permission_classes = (IsAuthenticated,)
     renderer_classes = (JSONRenderer,)
     serializer_class = UserSerializer
     def get(self, request):
        current_user = request.user
        return Response({"status":"ok","data":{"user":UserSerializer(current_user).data} }, status=status.HTTP_200_OK) 
