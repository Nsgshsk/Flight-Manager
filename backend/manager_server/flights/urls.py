from django.urls import path
from flights.views import PlaneTypes, Airports, Planes, Flights, AnnoFlights, PlaneSearch

urlpatterns = [
    path("", AnnoFlights.as_view({'get': 'list'})),
    path("<int:pk>/", AnnoFlights.as_view({'get':'retrieve'})),
    
    path("list/", Flights.as_view({'get': 'list', 'post': 'create'})),
    path("list/<int:pk>/", Flights.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})),
    
    path("planes/", Planes.as_view({'get': 'list', 'post': 'create'})),
    path("planes/search/", PlaneSearch.as_view()),
    path("planes/<str:pk>/", Planes.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'})),
    
    path("airports/", Airports.as_view()),
    path("planetypes/", PlaneTypes.as_view()),
]
