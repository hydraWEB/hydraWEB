from django.db import models
from core.models import TimestampedModel
from authentication.models import User

# Create your models here.
class Announcement(TimestampedModel):
    id = models.CharField(max_length=255, primary_key=True)
    title = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
  
