from rest_framework import pagination
from rest_framework.response import Response

""" 'links': {
    'next': self.get_next_link(),
    'previous': self.get_previous_link()
},
 """
 
class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response({
            'total_pages': self.page.paginator.num_pages,
            'count': self.page.paginator.count,
            'results': data
        })
