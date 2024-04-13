from django.db import models

# Create your models here.
class PlaneType(models.Model):
    iata_code = models.CharField(max_length=3)
    name = models.CharField(max_length=90)
    
    class Meta:
        ordering = ('iata_code',)

class Plane(models.Model):
    tail_number = models.CharField(max_length=10, primary_key=True)
    type = models.ForeignKey(PlaneType, on_delete=models.CASCADE)

class Airport(models.Model):
    iata_code = models.CharField(max_length=3)
    city = models.CharField(max_length=150)
    name = models.CharField(max_length=150)
    country = models.CharField(max_length=150)
    
    class Meta:
        ordering = ('iata_code',)

class Flight(models.Model):
    departure_airport = models.ForeignKey(Airport, on_delete=models.SET_NULL, null=True, related_name='flight_departure_airport_set')
    arrival_airport = models.ForeignKey(Airport, on_delete=models.SET_NULL, null=True, related_name='flight_arrival_airport_set')
    departure_datetime = models.DateTimeField()
    arrival_datetime = models.DateTimeField()
    plane = models.ForeignKey(Plane, on_delete=models.SET_NULL, null=True)
    pilot_name = models.CharField(max_length=200, blank=True)
    
    # Free seats on plane
    economy_seats = models.PositiveSmallIntegerField(default=0)
    business_seats = models.PositiveSmallIntegerField(default=0)
    first_seats = models.PositiveSmallIntegerField(default=0)