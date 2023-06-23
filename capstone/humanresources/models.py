from django.db import models
from django.contrib.auth.models import AbstractUser
# from phonenumber_field.modelfields import PhoneNumberField

# automatically generate passwords for employee for the first time
# use emails as login insted username(username not needed)
# create custom user
# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"email: {self.email}"


class Email(models.Model):
    MAIN = '1'
    EMPLOYER = '2'
    EMPLOYEE = '3'
    ACCOUNT_TYPE_CHOICES = [
        (MAIN, "Main"),
        (EMPLOYER, "Employer"),
        (EMPLOYEE, "Employee")
    ]

    account_type = models.CharField(max_length=1, blank=False,
                                    null=False, choices=ACCOUNT_TYPE_CHOICES, default=EMPLOYEE)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.email}: {self.account_type}"


class User_details(models.Model):
    user = models.ForeignKey(Email, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=64, blank=False)
    last_name = models.CharField(max_length=64, blank=True)
    surname = models.CharField(max_length=64, blank=False)
    birthday = models.DateField(blank=False)
    phone = models.IntegerField(null=False, blank=False)
    address1 = models.CharField(max_length=254, blank=False)
    address2 = models.CharField(max_length=254, blank=True)
    city = models.CharField(max_length=64, blank=False)
    state = models.CharField(max_length=64, blank=False)
    zip = models.CharField(max_length=10, blank=False)

    def __str__(self):
        return f"{self.first_name}, City: {self.city}, Phone: {self.phone}"


class Employer(models.Model):
    company = models.CharField(max_length=64, blank=False)
    email = models.EmailField(unique=True)
    phone1 = models.IntegerField(null=False, blank=False)
    phone2 = models.IntegerField(blank=True, null=True)
    address = models.CharField(max_length=254, blank=False)
    city = models.CharField(max_length=64, blank=False)
    state = models.CharField(max_length=64, blank=False)
    zip = models.CharField(max_length=10, blank=False)

    def __str__(self):
        return f"{self.company}, email: {self.email}"
