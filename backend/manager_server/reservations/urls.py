from django.urls import path
from reservations.views import Reservations, CustomerRequests, Nationalities

urlpatterns = [
    path("", CustomerRequests.as_view()),
    path("<int: customer_id>/", Reservations.as_view()),
    path("nationalities/", Nationalities.as_view()),
]
