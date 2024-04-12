from django.urls import path
from reservations.views import Reservations, CustomerRequests, Nationalities

urlpatterns = [
    path("", Reservations.as_view()),
    path("requests/", CustomerRequests.as_view()),
    path("nationalities/", Nationalities.as_view()),
]
