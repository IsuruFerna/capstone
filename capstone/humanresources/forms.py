from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, User_details, Email

DATE_INPUT_FORMATS = ('%d-%m-%Y', '%Y-%m-%d')


class AddEmployee(UserCreationForm):
    password1 = forms.CharField(label="Password",
                                strip=False,
                                widget=forms.PasswordInput(attrs={'class': 'form-control',
                                                                  'placeholder': 'Password'}))
    password2 = forms.CharField(label="Confirm Password",
                                strip=False,
                                widget=forms.PasswordInput(attrs={'class': 'form-control',
                                                                  'placeholder': 'Confirm Password'}))

    class Meta:
        model = User
        fields = ('email', 'password1', 'password2', 'account_type')

        widgets = {
            'email': forms.TextInput(attrs={'class': 'form-control',
                                            'placeholder': 'Email'}),
            # account_type is selected automatically by backend
        }


class FormEmployeeDetails(forms.ModelForm):
    class Meta:
        model = User_details
        fields = ('first_name', 'last_name', 'surname', 'birthday',
                  'phone', 'address1', 'address2', 'city', 'state', 'zip')

        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'First name'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Last name'}),
            'surname': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Surname'}),
            'birthday': forms.DateInput(attrs={'class': 'form-control', 'placeholder': 'Birthday', 'type': 'date'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Phone number'}),
            'address1': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '1234 Main St'}),
            'address2': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Apartment, studio or floor'}),
            'city': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'City'}),
            'state': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'State'}),
            'zip': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Zip'}),
        }


class User_email(forms.ModelForm):
    class Meta:
        model = Email
        fields = ('email',)

        widgets = {
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
        }


class TestForm(forms.Form):
    text = forms.CharField(max_length=64)
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
