from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    # pass
    password_reset = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username}, password reseted: {self.password_reset}"

    class Meta:
        abstract = True
