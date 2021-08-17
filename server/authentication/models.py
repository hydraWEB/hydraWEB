import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)

from django.db import models

from staff.models import SystemOperationEnum, SystemLog
from core.models import TimestampedModel

from django.core import exceptions


class UserManager(BaseUserManager):
    def create_user(self,username=None,email=None,password=None):
        if User.objects.filter(email=email).exists():
            user = self.get(email=email)
            return user
        
        user = self.model(
            username=username,
            email=email)
        
        user.set_password(password)
        user.save()
        SystemLog.objects.create_log(user=user,operation=SystemOperationEnum.USER_REGISTRATION)

        return user


# Create your models here.
class User(AbstractBaseUser, PermissionsMixin, TimestampedModel):

    userid = models.AutoField(primary_key=True)
    username = models.CharField(db_index=True, max_length=255)
    email = models.EmailField(db_index=True, unique=True, blank=True, null=True)
    avatar = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)

    # When a user no longer wishes to use our platform, they may try to delete
    # there account. That's a problem for us because the data we collect is
    # valuable to us and we don't want to delete it. To solve this problem, we
    # will simply offer users a way to deactivate their account instead of
    # letting them delete it. That way they won't show up on the site anymore,
    # but we can still analyze the data.
    is_active = models.BooleanField(default=True)

    # The `is_staff` flag is expected by Django to determine who can and cannot
    # log into the Django admin site. For most users, this flag will always be
    # falsed.
    is_staff = models.BooleanField(default=False)

    # More fields required by Django when specifying a custom user model.

    # The `USERNAME_FIELD` property tells us which field we will use to log in.
    # In this case, we want that to be the email field.
    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = []

    # Tells Django that the UserManager class defined above should manage
    # objects of this type.
    objects = UserManager()

    def __str__(self):
        """
        Returns a string representation of this `User`.
        This string is used when a `User` is printed in the console.
        """
        return self.email

    @property
    def token(self):
        """
        Allows us to get a user's token by calling `user.token` instead of
        `user.generate_jwt_token().
        The `@property` decorator above makes this possible. `token` is called
        a "dynamic property".
        """
        return self._generate_jwt_token()

    def get_full_name(self):
      """
      This method is required by Django for things like handling emails.
      Typically, this would be the user's first and last name. Since we do
      not store the user's real name, we return their username instead.
      """
      return self.username

    def get_short_name(self):
        """
        This method is required by Django for things like handling emails.
        Typically, this would be the user's first name. Since we do not store
        the user's real name, we return their username instead.
        """
        return self.username

    def _generate_jwt_token(self): 
        """
        Generates a JSON Web Token that stores this user's ID and has an expiry
        date set to 60 days into the future.
        """
        dt = datetime.now() + timedelta(days=60)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')

class BlackList():
    id = models.AutoField(primary_key=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
