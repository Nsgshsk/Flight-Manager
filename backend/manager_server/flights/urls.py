from django.urls import path
from flights.views import PlaneTypes, Airports, Planes, Flights, FlightDetails, AnnoFlights

urlpatterns = [
    path("", AnnoFlights.as_view()),
    path("<int: id>/", FlightDetails.as_view()),
    
    path("flights/", Flights.as_view()),
    path("flights/<int: id>/", Flights.as_view()),
    
    path("planes/", Planes.as_view()),
    path("airports/", Airports.as_view()),
    path("planetypes/", PlaneTypes.as_view()),
]
