from django.shortcuts import render
from rest_framework.response import Response

# Create your views here.
from rest_framework import viewsets, status
from rest_framework import views
import os 
import json


class LayerAPIView(views.APIView):

    def get(self,request):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        all_dir = os.listdir(f"{dir_path}\\data")
        result = []
        for dir in all_dir:
            json_list = os.listdir(f"{dir_path}\\data\\{dir}")
            res_json = []
            for js in json_list:
                f = open(f'{dir_path}\\data\\{dir}\\{js}',"r",encoding="utf-8")
                json_data = json.load(f)
                res_json.append({"name":f"{js}","data":json_data,"time_serie":False})
            result.append({"name":f"{dir}","file":res_json})


        return Response({"status":"created","data":result}, status=status.HTTP_200_OK)   

class LayerListAPIView(views.APIView):

    def post(self,request):
        pass
