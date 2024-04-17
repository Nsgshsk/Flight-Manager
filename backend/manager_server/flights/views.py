from django.core.paginator import Paginator, EmptyPage, InvalidPage, PageNotAnInteger

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import FlightsPermissions, AnnoFlightsPermissions

from flights.models import Flight, Plane, PlaneType, Airport
from flights.serializers import FlightSerializer, PlaneSerializer, PlaneTypeSerializer, AirportSerializer
from manager_server.paginators import ResultsSetPagination

# Create your views here.
class Flights(APIView):
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

class FlightDetails(APIView):
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

class AnnoFlights(APIView):
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

class AnnoFlightDetails(APIView):
    permission_classes = [AllowAny,]
    serializer_class = FlightSerializer
    
    def get(self, request, id):
        try:
            flight = Flight.objects.get(pk=id)
        except:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FlightSerializer(flight)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class Planes(APIView):
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

class PlaneDetails(APIView):
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

class PlaneTypes(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    serializer_class = PlaneTypeSerializer
    
    def get(self, request):
        serializer = PlaneTypeSerializer(PlaneType.objects.all(), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class Airports(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    serializer_class = AirportSerializer
    
    def get(self, request):
        serializer = AirportSerializer(Airport.objects.all(), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)