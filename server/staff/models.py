from django.db import models
from core.models import TimestampedModel
from django.db import models
from core.models import TimestampedModel
from enum import IntEnum
from django import forms

class AnnouncementManager(models.Manager):
    def create_announcement(self,title,content,user):
        a = Announcement(title=title, content=content,user=user)
        a.save(force_insert=True)
        return a

# Create your models here.
class Announcement(TimestampedModel):
    id = models.AutoField(primary_key=True)
    title = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    objects = AnnouncementManager()

    def edit_announcement(self,title,content,user):
        self.title = title
        self.content = content
        self.save()

    def delete_announcement(self,user):
        self.delete()


class SystemOperationEnum(IntEnum):
    USER_LOGIN = 1
    USER_REGISTRATION = 2
    


class SystemRecordManager(models.Manager):
    def create_log(self, user, operation):
        res = self.create(user=user, operation=operation)
    def get_log_by_year(self,year):
        res = self.filter(created_at__year=year)
        return res
    def get_log_by_year_and_month(self,year,month):
        res = self.filter(created_at__year=year).filter(created_at__month=month)
        return res
    def get_all_years(self):
        date_list = self.all().dates('created_at', 'year')
        year = []
        for date in date_list:
            year.append(date.year)
        return list(set(year))


class SystemLog(TimestampedModel):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    operation = models.IntegerField()
    objects = SystemRecordManager()

class IpSettingManager(models.Manager):
    def create_black_list(self, ip_address, user):
        res = self.create(ip_address=ip_address, user=user)

    def delete_black_list(self, ip_address):
        self.delete()

    def edit_black_list(self, ip_address):
        self.ip_address = ip_address
        self.save()

class IpSetting(TimestampedModel):
    """ id = models.AutoField(primary_key=True) """
    ip_address = models.GenericIPAddressField(primary_key=True)
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE, default ="")
    objects = IpSettingManager()


class SystemSetting(TimestampedModel):
    id = models.AutoField(primary_key=True)
    currentMode = models.IntegerField()

class SystemSettingManager(models.Manager):
    def edit_mode(self, currentMode):
        self.currentMode = currentMode
        self.save()