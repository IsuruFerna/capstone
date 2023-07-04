from django.db import models
from django.contrib.auth.models import AbstractUser

# from phonenumber_field.modelfields import PhoneNumberField

# automatically generate passwords for employee for the first time
# use emails as login insted username(username not needed)
# create custom user
# Create your models here.


class Email(models.Model):
    MAIN = '1'
    EMPLOYER = '2'
    EMPLOYEE = '3'
    ACCOUNT_TYPE_CHOICES = [
        (MAIN, "Main"),
        (EMPLOYER, "Employer"),
        (EMPLOYEE, "Employee")
    ]

    account_type = models.CharField(
        max_length=1, choices=ACCOUNT_TYPE_CHOICES, default=EMPLOYEE)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.email}: Account type: {self.account_type}"


class User(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # to get the account info directly to layout
    def acc_email(self):
        return Email.objects.get(email=self.email)

    # def acc_type(self):
    #     return Email.objects.get(email=self.username).account_type

    def __str__(self):
        return f"email: {self.email}"


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
    email = models.ForeignKey(Email, on_delete=models.CASCADE)
    company = models.CharField(max_length=64, blank=False, unique=True)
    phone1 = models.IntegerField(null=False, blank=False)
    phone2 = models.IntegerField(blank=True, null=True)
    address = models.CharField(max_length=254, blank=False)
    city = models.CharField(max_length=64, blank=False)
    state = models.CharField(max_length=64, blank=False)
    zip = models.CharField(max_length=10, blank=False)

    def __str__(self):
        return f"{self.company}"


class Task(models.Model):
    company = models.ForeignKey(Employer, on_delete=models.CASCADE)
    task = models.CharField(max_length=254, blank=False, null=False)
    description = models.CharField(max_length=600, blank=False, null=False)
    amount = models.IntegerField()

    def serialize(self):
        return {
            "id": self.pk,
            "company": self.company.company,
            "task": self.task,
            "description": self.description,
            "amount": self.amount
        }

    def __str__(self):
        return f"{self.company}: {self.task}"


class RequestWorker(models.Model):
    requested_by = models.ForeignKey(Employer, on_delete=models.CASCADE)
    task = models.CharField(max_length=254)
    amount = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    description = models.CharField(max_length=600)
    created = models.DateTimeField(auto_now=True)

    def serialize(self):
        return {
            "task": self.task,
            "amount": self.amount,
            "start_date": self.start_date.strftime("%b %d %Y"),
            "end_date": self.end_date.strftime("%b %d %Y"),
            "start_time": self.start_time.strftime("%I:%M %p"),
            "end_time": self.end_time.strftime("%I:%M %p"),
            "description": self.description,
            "created": self.created.strftime("%b %d %Y, %I:%M %p")
        }
