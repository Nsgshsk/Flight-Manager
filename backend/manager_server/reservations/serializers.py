from rest_framework import serializers
from reservations.models import CustomerRequest, Nationality, Reservation

class CustomerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerRequest
        fields = [
            'id',
            'email',
            'created',
            'flight',
            'status'
        ]

class NationalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = [
            'id',
            'name'
        ]

class ReservationSerializer(serializers.ModelSerializer):
    nationality_name = serializers.ReadOnlyField(source='nationality.name')
    
    class Meta:
        model = Reservation
        fields = [
            'id',
            'customer_request',
            'first_name',
            'middle_name',
            'nationality_reservation',
        ]