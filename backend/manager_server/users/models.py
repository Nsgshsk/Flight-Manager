from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
class User(AbstractUser):
    ADMIN = 1
    EMPLOYEE = 2
    
    ROLE_CHOICES = (
        (ADMIN, "Admin"),
        (EMPLOYEE, "Employee")
    )
    
    egn = models.CharField(max_length=10, unique=True)
    address = models.CharField(max_length=150, blank=True)
    phone_number = PhoneNumberField(region="BG", blank=True)
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES)
    
    REQUIRED_FIELDS = ["email", "egn"]