from django.urls import path,include
from .views import MyObtainTokenPairView, RegisterView,ResetPasswordView,ProfileAPIView,EditProfileAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('password_reset/confirm/', ResetPasswordView.as_view(), name="reset-password-confirm"),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    path('user/profile', ProfileAPIView.as_view(), name="profile"),
    path('user/profile/edit', EditProfileAPIView.as_view(), name="profile"),

]