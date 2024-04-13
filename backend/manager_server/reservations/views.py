from django.core.paginator import Paginator

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
    
    def get(self, request, customer_id):
        reservations = Reservation.objects.filter(customer_request__id=customer_id)
        
        serializer = ReservationSerializer(reservations, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        customer_data = request.data['customer']
        reservation_data_list = request.data['reservations']
        
        customer = CustomerRequestSerializer(customer_data)
        if not customer.is_valid():
            return Response(data=customer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if len(reservation_data_list) > 10:
            return Response(data={'message': 'Too many reservations! (The max is 10.)'}, status=status.HTTP_400_BAD_REQUEST)
        
        customer.save()
        for reservation_data in reservation_data_list:
            reservation_data['customer'] = customer.validated_data['id']
            reservation = ReservationSerializer(reservation_data)
            if reservation.is_valid():
                reservation.save()
            else:
                CustomerRequest.objects.filter(pk=customer.validated_data['id']).delete()
                return Response(data=reservation.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email_handle = CustomerRequests()
        response = email_handle.confirm_request(request)
        return response
    
    def delete(self, request):
        serializer = CustomerRequestSerializer(request.data)
        if serializer.is_valid():
            CustomerRequest.objects.filter(pk=serializer.validated_data).delete()
            return Response(data={'message': 'Request deleted!'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(data={'message': 'Invalid request!'}, status=status.HTTP_400_BAD_REQUEST)

class CustomerRequests(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        customers = CustomerRequest.objects.all()
        
        page_number = self.request.query_params.get('page_number ', 1)
        page_size = self.request.query_params.get('page_size ', 10)

        paginator = Paginator(customers , page_size)
        
        serializer = CustomerRequestSerializer(paginator.page(page_number), many=True, context={'request': request})
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    def confirm_request(self, request):
        customer_data = request.data.get('customer', None)
        if customer_data is None:
            customer_data = request.data
        
        serializer = CustomerRequestSerializer(customer_data)
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
            
            left_economy_seats = flight.all_seats() - reservation_list.filter(type=1).count()
            left_business_seats = flight.all_seats() - reservation_list.filter(type=2).count()
            left_first_seats = flight.all_seats() - reservation_list.filter(type=3).count()
            
            type = 0
            if left_economy_seats < 0:
                type = 1
            elif left_business_seats < 0:
                type = 2
            elif left_first_seats < 0:
                type = 3
                
            if type > 0:
                customer.status = 3
                message = f"""
                Dear Customer,
                
                We regret to inform you that we are unable to confirm your reservation for the flight to {flight.arrival_airport} on {flight.departure_datetime} due to the unavailability of free seats in the selected seat types. Unfortunately, there are not enough seats in the {TYPE_CHOICES[type]} class to accommodate all requested passengers on the plane.
                We understand the inconvenience this may cause and apologize for any disruption to your travel plans. Our team has made every effort to secure your preferred seat type; however, the current capacity constraints prevent us from fulfilling your reservation.
                As a result, we have canceled your reservation for the flight. Rest assured, any payment made for the reservation will be fully refunded to the original payment method used during the booking process. The refund process may take some time to complete, and we appreciate your patience in this matter.
                We sincerely apologize for any inconvenience this may have caused and hope to have the opportunity to serve you on a future flight. If you have any questions or require further assistance, please do not hesitate to contact our customer service team at [Customer Service Contact Information].
                Thank you for your understanding.
                
                Warm regards,
                [Your Airline Name]"""
            
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