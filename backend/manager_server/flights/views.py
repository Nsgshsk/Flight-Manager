from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.generics import ListAPIView

from rest_framework.filters import SearchFilter, OrderingFilter

from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import FlightsPermissions

from flights.models import Flight, Plane, PlaneType, Airport
from flights.serializers import FlightSerializer, PlaneSerializer, PlaneTypeSerializer, AirportSerializer
from manager_server.paginators import ResultsSetPagination
from dateutil import parser

# Create your views here.
class Flights(ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAuthenticated, FlightsPermissions]
    pagination_class = ResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = [
        'departure_airport',
        'arrival_airport', 
        'plane__tail_number',
        'pilot_name',
    ]
    ordering_fields = '__all__'
    ordering = ['departure_datetime']

class AnnoFlights(ReadOnlyModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [AllowAny]
    pagination_class = ResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = [
        'departure_airport',
        'arrival_airport', 
        'plane__tail_number',
        'pilot_name',
    ]
    ordering_fields = '__all__'
    ordering = ['departure_datetime']
    
    def list(self, request):
        params = self.request.query_params
        flights = self.queryset
        
        departure = params.get('departure_location', None)
        print(departure)
        if departure is not None and departure != 'null':
            departure_list = departure.split(', ')
            flights = flights.filter(departure_airport__country=departure_list[1]).filter(departure_airport__city=departure_list[0])
        
        seat_class = params.get('class', None)
        arrival_location = params.get('arrival_location', None)
        departure_date = params.get('departure_date', None)
        
        if seat_class is not None and seat_class != 'null':
            if seat_class == 1:
                flights = flights.filter(economy_seats__gt=0)
            elif seat_class == 2:
                flights = flights.filter(business_seats__gt=0)
            elif seat_class == 3:
                flights = flights.filter(first_seats__gt=0)
        
        if arrival_location is not None and arrival_location != 'null':
            flights = flights.filter(arrival_airport__city=arrival_location)
        
        if departure_date is not None and departure_date != 'null':
            departure_parsed = parser.parse(''.join(departure_date[:-31]))
            print(departure_parsed)
            flights = flights.filter(departure_datetime__gte=departure_parsed)
        
        flights = flights.order_by('departure_datetime')
        
        self.queryset = flights
        
        return super().list(request)

class Planes(ModelViewSet):
    queryset = Plane.objects.all()
    serializer_class = PlaneSerializer
    permission_classes = [IsAuthenticated, FlightsPermissions]
    pagination_class = ResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['tail_number', 'type__name', 'type__iata_code']
    ordering_fields = ['tail_number', 'data__type']
    ordering = ['tail_number']

class PlaneSearch(ListAPIView):
    queryset = Plane.objects.all()
    serializer_class = PlaneSerializer
    permission_classes = [IsAuthenticated, FlightsPermissions]
    pagination_class = None

class PlaneTypes(ListAPIView):
    queryset = PlaneType.objects.all()
    serializer_class = PlaneTypeSerializer
    permission_classes = [IsAuthenticated, FlightsPermissions]
    pagination_class = None

class Airports(ListAPIView):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer
    permission_classes = [AllowAny]
    pagination_class = None