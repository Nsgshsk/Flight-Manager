from django.urls import path
from reservations.views import CustomerRequests, Nationalities

urlpatterns = [
    path("", CustomerRequests.as_view({'get': 'list', 'post': 'created'})),
    path("<int:id>/", CustomerRequests.as_view({'get':'retrieve', 'post': 'confirm_request', 'delete': 'destroy'})),
    path("nationalities/", Nationalities.as_view()),
]
