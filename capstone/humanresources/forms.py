from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

# class CustomUserCreationForm(UserCreationForm):
#     # Define the choices for the account type field
#     MAIN = '1'
#     EMPLOYER = '2'
#     EMPLOYEE = '3'
#     ACCOUNT_TYPE_CHOICES = [
#         (MAIN, "Main"),
#         (EMPLOYER, "Employer"),
#         (EMPLOYEE, "Employee")
#     ]

#     account_type = forms.ChoiceField(choices=ACCOUNT_TYPE_CHOICES)
#     password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
#     password2 = forms.CharField(label="Password Confirmation", widget=forms.PasswordInput)

#     class Meta:
#         model = User
#         fields = ["account_type", "username", "password1", "password2"]

#     def clean_password2(self):
#         # Check that the two password entries match
#         password1 = self.cleaned_data.get("password1")
#         password2 = self.cleaned_data.get("password2")
#         if password1 and password2 and password1 != password2:
#             raise forms.ValidationError("Passwords don't match")
#         return password2

#     def account_type_choice(self):
#         choice = self.cleaned_data.get("account_type")
#         if not int(choice) in range(1, 4):
#             raise forms.ValidationError("Account type doesn't match any of the available choices")
#         return choice

#     def save(self, commit=True):
#         # Save the provided password in hashed format
#         user = super().save(commit=False)
#         user.set_password(self.cleaned_data["password1"])
#         if commit:
#             user.save()
#         return user
