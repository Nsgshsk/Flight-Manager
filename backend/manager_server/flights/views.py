from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from rest_framework.filters import SearchFilter, OrderingFilter

from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import FlightsPermissions, AnnoFlightsPermissions

from flights.models import Flight, Plane, PlaneType, Airport
from flights.serializers import FlightSerializer, PlaneSerializer, PlaneTypeSerializer, AirportSerializer
from manager_server.paginators import ResultsSetPagination

# Create your views here.
class FlightsOld(APIView):
    permission_classes = [(IsAuthenticated & FlightsPermissions) | (AllowAny & AnnoFlightsPermissions)]
    serializer_class = FlightSerializer
    pagination_class = ResultsSetPagination
    
    def get(self, request):
        params = self.request.query_params
        
        flights = Flight.objects.all()
        
        sort_field = params.get('sortField', None)
        sort_order = params.get('sortOrder', 'ascend')
        
        if sort_field is not None:
            if sort_order == 'ascend':
                flights.order_by(sort_field)
            elif sort_order == 'descend':
                flights.order_by(f'-{sort_field}')
        
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(flights, request)
        
        if page is not None:
            return paginator.get_paginated_response(page)
        
        serializer = FlightSerializer(flights, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Flight created succesfully!'}, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FlightDetailsOld(APIView):
    permission_classes = [(IsAuthenticated & FlightsPermissions) | (AllowAny & AnnoFlightsPermissions)]
    serializer_class = FlightSerializer
    
    def get(self, request, id):
        try:
            flight = Flight.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FlightSerializer(flight)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, id):
        try:
            flight = Flight.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PlaneSerializer(flight, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        try:
            flight = Flight.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)

        flight.delete()
        return Response({'message': 'Flight deleted!'}, status=status.HTTP_204_NO_CONTENT)

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

class AnnoFlightsOld(APIView):
    permission_classes = [AllowAny,]
    serializer_class = FlightSerializer
    
    def get(self, request):
        params = self.request.query_params
        
        departure = params.get('departure_airport', None)
        if departure is None:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        
        departure_city, departure_country = tuple(', '.split(departure))
        
        flights = Flight.objects.filter(departure_airport__country=departure_country).filter(departure_airport__city=departure_city)
        
        seat_class = params.get('class', None)
        arrivalAt = params.get('arrivalAt', None)
        departureDate = params.get('departureDate', None)
        
        if seat_class is not None:
            if seat_class == 1:
                flights = flights.filter(economy_seats__gt=0)
            elif seat_class == 2:
                flights = flights.filter(business_seats__gt=0)
            elif seat_class == 3:
                flights = flights.filter(first_seats__gt=0)
        
        if arrivalAt is not None:
            flights = flights.filter(arrival_airport__city=arrivalAt)
        
        if departureDate is not None:
            flights = flights.filter(departure_datetime__gte=departureDate)
        
        flights = flights.order_by('departure_datetime')
        
        sort_field = params.get('sortField', None)
        sort_order = params.get('sortOrder', 'ascend')
        
        if sort_field is not None:
            if sort_order == 'ascend':
                flights.order_by(sort_field)
            elif sort_order == 'descend':
                flights.order_by(f'-{sort_field}')
        
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(flights, request)
        
        if page is not None:
            return paginator.get_paginated_response(page)
        
        serializer = FlightSerializer(flights, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK) 

class AnnoFlightDetailsOld(APIView):
    permission_classes = [AllowAny,]
    serializer_class = FlightSerializer
    
    def get(self, request, id):
        try:
            flight = Flight.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FlightSerializer(flight)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class AnnoFlights(ReadOnlyModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [AllowAny]
    pagination_class = ResultsSetPagination
    
    def list(self, request):
        params = self.request.query_params
        flights = self.queryset
        
        departure = params.get('departure_location', None)
        if departure is not None:
            departure_city, departure_country = tuple(', '.split(departure))
            flights = flights.filter(departure_airport__country=departure_country).filter(departure_airport__city=departure_city)
        
        seat_class = params.get('class', None)
        arrival_location = params.get('arrival_location', None)
        departure_date = params.get('departure_date', None)
        
        if seat_class is not None:
            if seat_class == 1:
                flights = flights.filter(economy_seats__gt=0)
            elif seat_class == 2:
                flights = flights.filter(business_seats__gt=0)
            elif seat_class == 3:
                flights = flights.filter(first_seats__gt=0)
        
        if arrival_location is not None:
            flights = flights.filter(arrival_airport__city=arrival_location)
        
        if departure_date is not None:
            flights = flights.filter(departure_datetime__gte=departure_date)
        
        flights = flights.order_by('departure_datetime')
        
        sort_field = params.get('sortField', None)
        sort_order = params.get('sortOrder', 'ascend')
        
        if sort_field is not None:
            if sort_order == 'ascend':
                flights.order_by(sort_field)
            elif sort_order == 'descend':
                flights.order_by(f'-{sort_field}')
        
        self.queryset = flights
        
        return super().list(request)

class PlanesOld(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    serializer_class = PlaneSerializer
    
    def get(self, request):
        params = self.request.query_params
        
        planes = Plane.objects.all()
        
        sort_field = params.get('sortField', None)
        sort_order = params.get('sortOrder', 'ascend')
        
        if sort_field is not None:
            if sort_order == 'ascend':
                planes.order_by(sort_field)
            elif sort_order == 'descend':
                planes.order_by(f'-{sort_field}')
        
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(planes, request)
        
        if page is not None:
            return paginator.get_paginated_response(page)
        
        serializer = FlightSerializer(planes, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = PlaneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Plane created succesfully!'}, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PlaneDetailsOld(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    serializer_class = PlaneSerializer
    
    def get(self, request, id):
        try:
            plane = Plane.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PlaneSerializer(plane)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, id):
        try:
            plane = Plane.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PlaneSerializer(plane, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        try:
            plane = Plane.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)

        plane.delete()
        return Response({'message': 'Plane deleted!'}, status=status.HTTP_204_NO_CONTENT)

class Planes(ModelViewSet):
    queryset = Plane.objects.all()
    serializer_class = PlaneSerializer
    permission_classes = [IsAuthenticated, FlightsPermissions]
    pagination_class = ResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['tail_number', 'type__name', 'type__iata_code']
    ordering_fields = ['tail_number', 'data__type']
    ordering = ['tail_number']

class PlaneTypesOld(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    serializer_class = PlaneTypeSerializer
    
    def get(self, request):
        serializer = PlaneTypeSerializer(PlaneType.objects.all(), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class PlaneTypes(ListAPIView):
    queryset = PlaneType.objects.all()
    serializer_class = PlaneTypeSerializer
    permission_classes = [IsAuthenticated, FlightsPermissions]
    pagination_class = None

class AirportsOld(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    serializer_class = AirportSerializer
    
    def get(self, request):
        serializer = AirportSerializer(Airport.objects.all(), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class Airports(ListAPIView):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer
    permission_classes = [AllowAny]
    pagination_class = None