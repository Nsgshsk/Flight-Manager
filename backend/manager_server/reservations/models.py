from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from flights.models import Flight

# Create your models here.
class CustomerRequest(models.Model):
    PENDING = 1
    COMPLETE = 2
    CANCELED = 3
    
    STATUS_CHOICES = (
        (PENDING, "Pending"),
        (COMPLETE, "Complete"),
        (CANCELED, "Canceled"),
    )
    
    email = models.EmailField()
    created = models.DateTimeField(auto_now_add=True)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, default=PENDING, blank=True)

class Nationality(models.Model):
    name = models.CharField(max_length=150)
    
    class Meta:
        ordering = ('name',)

class Reservation(models.Model):
    ECONOMY = 1
    BUSINESS = 2
    FIRST = 3
    
    TYPE_CHOICES = (
        (ECONOMY, "Economy"),
        (BUSINESS, "Business"),
        (FIRST, "First"),
    )
    
    customer_request = models.ForeignKey(CustomerRequest, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=150)
    middle_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150)
    egn = models.CharField(max_length=10)
    phone_number = PhoneNumberField(region="BG", blank=True)
    nationality = models.ForeignKey(Nationality, on_delete=models.SET_NULL, null=True)
    type = models.PositiveSmallIntegerField(choices=TYPE_CHOICES)