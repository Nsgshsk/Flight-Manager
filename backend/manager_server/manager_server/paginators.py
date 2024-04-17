from rest_framework.pagination import PageNumberPagination

class ResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'results'
    max_page_size = 100