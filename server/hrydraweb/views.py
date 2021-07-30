from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status


class MapDataViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        from influxdb_metrics.utils import query
        query('select * from series.name', time_precision='s', chunked=False)

        pass
