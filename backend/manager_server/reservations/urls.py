from django.urls import path
from reservations.views import CustomerRequests, CustomerRequestDetails, Nationalities

urlpatterns = [
    path("", CustomerRequests.as_view()),
    path("<int:id>/", CustomerRequestDetails.as_view()),
    path("nationalities/", Nationalities.as_view()),
]
