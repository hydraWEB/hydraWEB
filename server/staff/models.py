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
        SystemLog.objects.create_log(user=user,operation=SystemOperationEnum.STAFF_CREATE_ANNOUNCEMENT)
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
        SystemLog.objects.create_log(user=user,operation=SystemOperationEnum.STAFF_EDIT_ANNOUNCEMENT)

    def delete_announcement(self,user):
        self.delete()
        SystemLog.objects.create_log(user=user,operation=SystemOperationEnum.STAFF_DELETE_ANNOUNCEMENT)


class SystemOperationEnum(IntEnum):
    USER_LOGIN = 1
    USER_REGISTRATION = 2
    STAFF_CREATE_ANNOUNCEMENT = 3
    STAFF_EDIT_ANNOUNCEMENT = 4
    STAFF_DELETE_ANNOUNCEMENT = 5
    USER_READ_HYDRAWEB_LAYER = 6
    STAFF_CREATE_BLACKLIST = 7
    STAFF_DELETE_BLACKLIST = 8
    STAFF_EDIT_BLACKLIST = 9
    
SystemOperationCh = {
    SystemOperationEnum.USER_LOGIN: "使用者登入",
    SystemOperationEnum.USER_REGISTRATION: "使用者註冊",
    SystemOperationEnum.STAFF_CREATE_ANNOUNCEMENT: "管理員新增公告",
    SystemOperationEnum.STAFF_EDIT_ANNOUNCEMENT: "管理員編輯公告",
    SystemOperationEnum.STAFF_DELETE_ANNOUNCEMENT: "管理員刪除公告",
    SystemOperationEnum.USER_READ_HYDRAWEB_LAYER: "使用者讀取圖層",
    SystemOperationEnum.STAFF_CREATE_BLACKLIST: "管理員新增黑名單",
    SystemOperationEnum.STAFF_DELETE_BLACKLIST: "管理員刪除黑名單",
    SystemOperationEnum.STAFF_EDIT_BLACKLIST: "管理員編輯黑名單",
}

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
        SystemLog.objects.create_log(user=user,operation=SystemOperationEnum.STAFF_CREATE_BLACKLIST)

    def delete_black_list(self, ip_address):
        self.delete()
        SystemLog.objects.create_log(user=None,operation=SystemOperationEnum.STAFF_DELETE_BLACKLIST)

    def edit_black_list(self, ip_address):
        self.ip_address = ip_address
        self.save()

class IpSetting(TimestampedModel):
    id = models.AutoField(primary_key=True)
    ip_address = models.GenericIPAddressField()
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE, default ="")
    objects = IpSettingManager()


class SystemSetting(TimestampedModel):
    id = models.AutoField(primary_key=True)
    currentMode = models.IntegerField()

class SystemSettingManager(models.Manager):
    def edit_mode(self, currentMode):
        self.currentMode = currentMode
        self.save()