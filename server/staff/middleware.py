from .models import IpSetting
from django.http import HttpResponse

class IpBlockMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        all_ip = IpSetting.objects.all()
        print(self.get_client_ip(request))            
        get_ip = self.get_client_ip(request)

        for ip in all_ip:
            if ip.ip_address == get_ip:
                return HttpResponse('ip not allowed')


        response = self.get_response(request) 

        # Code to be executed for each request/response after
        # the view is called.

        return response

    def get_client_ip(self,request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip