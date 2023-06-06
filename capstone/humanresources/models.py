from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    # pass
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
    password_reset = models.BooleanField(default=False)

    def __str__(self):
        return f"Account Type:{self.account_type}: {self.username}, password reseted: {self.password_reset}"
