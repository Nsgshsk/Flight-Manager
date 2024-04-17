from django.urls import path
from flights.views import PlaneTypes, Airports, Planes, Flights, FlightDetails, AnnoFlights, PlaneDetails

urlpatterns = [
    path("", AnnoFlights.as_view()),
    path("<int:id>/", FlightDetails.as_view()),
    
    path("list/", Flights.as_view()),
    path("list/<int:id>/", FlightDetails.as_view()),
    
    path("planes/", Planes.as_view()),
    path("planes/<string:id>/", PlaneDetails.as_view()),
    
    path("airports/", Airports.as_view()),
    path("planetypes/", PlaneTypes.as_view()),
]
