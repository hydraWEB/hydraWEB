from django.shortcuts import render
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
from rest_framework import viewsets, status
from rest_framework import views
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
import os
# Create your views here.


class MapAPIView(views.APIView):
    # permission_classes = (IsAuthenticated,)
    renderer_classes = (JSONRenderer,)
    url = "http://localhost:8086"

    def get_queryset(self):
      token = os.environ.get('INFLUX_TOKEN')
      org = os.environ.get('INFLUX_ORG')
      bucket = os.environ.get('INFLUX_BUCKET')

      type = self.request.query_params.get('type', None)
      data = []
      client = influxdb_client.InfluxDBClient(
          url=self.url,
          token=token,
          org=org
      )
      geojson = {
          "type": "FeatureCollection",
          "features": []
      }
      query_api = client.query_api()
      
      query = f'from (bucket:"{bucket}")\
      |> range(start: 1970-01-01T00:00:00Z)'
      result = client.query_api().query(org=org, query=query)
      results = []
      sorted_result = []
      for table in result:
            for record in table.records:
                results.append((record.get_measurement(),record.get_field(), record.get_value(), record.get_time()))

      return results

    def get(self, request):
        return Response({"status": "ok", "data": self.get_queryset()}, status=status.HTTP_200_OK)
