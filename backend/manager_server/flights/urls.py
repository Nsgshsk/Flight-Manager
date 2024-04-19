from django.urls import path
from flights.views import PlaneTypes, Airports, Planes, Flights, AnnoFlights

urlpatterns = [
    path("", AnnoFlights.as_view({'get': 'list'})),
    path("<int:id>/", AnnoFlights.as_view({'get':'retrieve'})),
    
    path("list/", Flights.as_view({'get': 'list', 'post': 'create'})),
    path("list/<int:id>/", Flights.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})),
    
    path("planes/", Planes.as_view({'get': 'list', 'post': 'create'})),
    path("planes/<str:id>/", Planes.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})),
    
    path("airports/", Airports.as_view()),
    path("planetypes/", PlaneTypes.as_view()),
]
