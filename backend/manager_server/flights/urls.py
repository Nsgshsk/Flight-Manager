from django.urls import path
from flights.views import PlaneTypes, Airports, Planes, Flights

urlpatterns = [
    path("", Flights.as_view()),
    path("planes/", Planes.as_view()),
    path("airports/", Airports.as_view()),
    path("planetypes/", PlaneTypes.as_view()),
]
