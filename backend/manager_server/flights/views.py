from django.core.paginator import Paginator

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated, AllowAny
from users.permissions import FlightsPermissions, AnnoFlightsPermissions

from flights.models import Flight, Plane, PlaneType, Airport
from flights.serializers import FlightSerializer, PlaneSerializer, PlaneTypeSerializer, AirportSerializer

# Create your views here.
class Flights(APIView):
    permission_classes = [(IsAuthenticated & FlightsPermissions) | (AllowAny & AnnoFlightsPermissions)]
    serializer_class = FlightSerializer
    
    def get(self, request):
        flights = Flight.objects.all()
        
        page_number = self.request.query_params.get('page_number ', 1)
        page_size = self.request.query_params.get('page_size ', 10)

        paginator = Paginator(flights, page_size)
        
        serializer = FlightSerializer(paginator.page(page_number), many=True, context={'request': request})
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
        
        departure = params.get('depratureFrom', None)
        if departure is None:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        
        flights = Flight.objects.filter(departure_airport__city=departure)
        
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
        
        page_number = params.get('page_number ', 1)
        page_size = params.query_params.get('page_size ', 10)

        paginator = Paginator(flights, page_size)
        
        serializer = FlightSerializer(paginator.page(page_number), many=True, context={'request': request})
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
        planes = Plane.objects.all()
        
        page_number = self.request.query_params.get('page_number ', 1)
        page_size = self.request.query_params.get('page_size ', 10)

        paginator = Paginator(planes, page_size)
        
        serializer = FlightSerializer(paginator.page(page_number), many=True, context={'request': request})
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