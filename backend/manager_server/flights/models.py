from django.db import models

# Create your models here.
class PlaneType(models.Model):
    iata_code = models.CharField(max_length=3, primary_key=True)
    name = models.CharField(max_length=90)

class Plane(models.Model):
    tail_number = models.CharField(max_length=10, primary_key=True)
    type = models.ForeignKey(PlaneType, on_delete=models.CASCADE)

class Airport(models.Model):
    iata_code = models.CharField(max_length=3, primary_key=True)
    city = models.CharField(max_length=150)
    name = models.CharField(max_length=150)
    country = models.CharField(max_length=150)

class Flight(models.Model):
    departure_airport = models.ForeignKey(Airport, on_delete=models.SET_NULL, null=True)
    arrival_airport = models.ForeignKey(Airport, on_delete=models.SET_NULL, null=True)
    departure_datetime = models.DateTimeField()
    arrival_datetime = models.DateTimeField()
    plane = models.ForeignKey(Plane, on_delete=models.SET_NULL, null=True)
    pilot_name = models.CharField(max_length=200)
    economy_seats = models.PositiveSmallIntegerField(default=0)
    business_seats = models.PositiveSmallIntegerField(default=0)
    first_seats = models.PositiveSmallIntegerField(default=0)