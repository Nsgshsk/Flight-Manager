from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import AllowAny, IsAuthenticated
from users.permissions import AnnoReservationsPermissions, ReservationsPermissions

from reservations.models import CustomerRequest, Nationality, Reservation
from reservations.serializers import CustomerRequestSerializer, NationalitySerializer, ReservationSerializer

from django.core.mail import send_mail

TYPE_CHOICES = { 1: 'Economy', 2: 'Business', 3: 'First'}
# Create your views here.
class Reservations(APIView):
    permission_classes = [
        (AllowAny & AnnoReservationsPermissions)
        | (IsAuthenticated & ReservationsPermissions)
    ]
    
    def get(self, request):
        serializer = ReservationSerializer(Reservation.objects.all(), many=True)
        return Response(data=serializer, status=status.HTTP_200_OK)
    
    def post(self, request):
        customer_data = request.data['customer']
        reservation_data_list = request.data['reservations']
        
        customer = CustomerRequestSerializer(customer_data)
        if not customer.is_valid():
            return Response(data=customer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        customer.save()
        for reservation_data in reservation_data_list:
            reservation_data['customer'] = customer.validated_data['id']
            reservation = ReservationSerializer(reservation_data)
            if reservation_data.is_valid():
                reservation_data.save()
            else:
                CustomerRequest.objects.filter(pk=customer.validated_data['id']).delete()
                return Response(data=reservation.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(data={'message': 'Request sent!'}, status=status.HTTP_201_CREATED)  
    
    def delete(self, request):
        serializer = CustomerRequestSerializer(request.data)
        if serializer.is_valid():
            CustomerRequest.objects.filter(pk=serializer.validated_data).delete()
            return Response(data={'message': 'Request deleted!'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)

class CustomerRequests(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = CustomerRequestSerializer(request.data)
        if serializer.is_valid() and serializer.validated_data['status'] == 1:
            customer = CustomerRequest.objects.filter(pk=serializer.validated_data['id']).first()
            flight = customer.flight
            message = f"""
            Dear Customer,
            
            Thank you for booking your flight with us! We are pleased to confirm your flight details:
                
            Plane Number: {flight.plane.tail_number}
            Departure Airport: {flight.departure_airport.name}
            Departure Time: {flight.departure_datetime}
            Arrival Airport: {flight.arrival_airport.name}
            Arrival Time: {flight.arrival_datetime}
            
            Passenger Information:
            
            """
            reservation_list = customer.reservation_set.all()
            
            all_seats = flight.economy_seats + flight.business_seats + flight.first_seats
            left_seats = all_seats - reservation_list.count()
            
            if left_seats < 0:
                customer.status = 3
                
            
            for reservation in reservation_list:
                type = reservation.type
                if type == 1:
                    flight.economy_seats -= 1
                elif type == 2:
                    flight.business_seats -= 1
                elif type == 3:
                    flight.first_seats -= 1
                    
                message += f"""
                Name: {reservation.frist_name + ' ' + reservation.last_name}
                Phone number: {reservation.phone_number}
                Nationality: {reservation.nationality}
                Seat type: {TYPE_CHOICES[type]}
                
                """
            message += """
            Please review the information carefully and let us know if there are any errors or changes. 
            If you have any questions or concerns, please contact us at [Customer Support Email] or [Customer Support Phone Number].
            Thank you for choosing our airline. We look forward to serving you on your upcoming flight.
            
            Best regards,
            [Your Airline Name]
            """
            send_mail(
                subject="Reservation Confirmation",
                message=message,
                recipient_list=[customer.email],
                fail_silently=False,
            )
            return Response({'message': 'Request confirmed!'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)

class Nationalities(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        serializer = NationalitySerializer(Nationality.objects.all(), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)