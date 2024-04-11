from django.db import models

# Create your models here.
class Flight(models.Model):
    departure_airport = models.CharField(max_length=150, blank=False),
    arrival_airport = models.CharField(max_length=150, blank=False),
    departure_datetime = models.DateTimeField(blank=False)
    arrival_datetime = models.DateTimeField(blank=False)
    plane_type = models.ForeignKey()
    plane_id = models.ForeignKey()
    pilot_name = models.CharField(max_length=60, blank=False)
    passengers_places = models.PositiveSmallIntegerField()