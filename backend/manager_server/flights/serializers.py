from rest_framework import serializers
from flights.models import PlaneType, Plane, Airport, Flight
from django.utils.dateparse import parse_datetime

class PlaneTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaneType
        fields = [
            'id',
            'iata_code',
            'name'
        ]

class PlaneSerializer(serializers.ModelSerializer):
    type = serializers.PrimaryKeyRelatedField(queryset=PlaneType.objects.all())
    
    class Meta:
        model = Plane
        fields = [
            'tail_number',
            'type'
        ]

class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = [
            'id',
            'iata_code',
            'city',
            'name',
            'country'
        ]
        
class FlightSerializer(serializers.ModelSerializer):
    departure_airport = serializers.PrimaryKeyRelatedField(queryset=Airport.objects.all())
    arrival_airport = serializers.PrimaryKeyRelatedField(queryset=Airport.objects.all())
    plane = serializers.PrimaryKeyRelatedField(queryset=Plane.objects.all())
    
    class Meta:
        model = Flight
        fields = [
            'id',
            'departure_airport',
            'arrival_airport',
            'departure_datetime',
            'arrival_datetime',
            'plane',
            'pilot_name',
            'economy_seats',
            'business_seats',
            'first_seats'
        ]
    
    def validate_arrival_datetime(self, value):
        if parse_datetime(self.initial_data['departure_datetime']) > value:
            raise serializers.ValidationError("Arrival time can't be before departure!")
        return value