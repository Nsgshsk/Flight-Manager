from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from users.permissions import FlightsPermissions

from flights.models import Flight, Plane, PlaneType, Airport
from flights.serializers import FlightSerializer, PlaneSerializer, PlaneTypeSerializer, AirportSerializer

# Create your views here.
class Flights(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    
    def get(self, request):
        serializer = FlightSerializer(Flight.objects.all(), many=True)
        return Response(data=serializer, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Flight created succesfully!'}, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        if request.data['id'] is None:
            return Response(data=serializer.data, status=status.HTTP_400_BAD_REQUEST)
        
        flight = Flight.objects.get(pk=request.data['id'])
        serializer = FlightSerializer(flight, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            Flight.objects.filter(pk=serializer.validated_data['id']).delete()
            return Response({'message': 'Flight deleted!'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)

class Planes(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    
    def get(self, request):
        serializer = PlaneSerializer(Plane.objects.all(), many=True)
        return Response(data=serializer, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = PlaneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Plane created succesfully!'}, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        if request.data['id'] is None:
            return Response(data=serializer.data, status=status.HTTP_400_BAD_REQUEST)
        
        plane = Plane.objects.get(pk=request.data['id'])
        serializer = PlaneSerializer(plane, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        serializer = PlaneSerializer(data=request.data)
        if serializer.is_valid():
            Flight.objects.filter(pk=serializer.validated_data['id']).delete()
            return Response({'message': 'Plane deleted!'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)
   
class PlaneTypes(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    
    def get(self, request):
        serializer = PlaneTypeSerializer(PlaneType.objects.all(), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

class Airports(APIView):
    permission_classes = [IsAuthenticated, FlightsPermissions]
    
    def get(self, request):
        serializer = AirportSerializer(Airport.objects.all(), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)