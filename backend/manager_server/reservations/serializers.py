from rest_framework import serializers
from reservations.models import CustomerRequest, Nationality, Reservation

from users.validators import EgnValidator

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
    customer_request = serializers.PrimaryKeyRelatedField(queryset=CustomerRequest.objects.all())
    nationality = serializers.SlugRelatedField(slug_field='name', queryset=Nationality.objects.all())
    
    class Meta:
        model = Reservation
        fields = [
            'id',
            'customer_request',
            'first_name',
            'middle_name',
            'egn',
            'phone_number'
            'nationality',
            'type'
        ]
        
    def validate_egn(self, value):
        if not EgnValidator.validate_egn(value):
            raise serializers.ValidationError('Egn is not valid!')
        return value