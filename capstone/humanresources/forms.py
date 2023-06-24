from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, User_details, Email, Employer, Task

# DATE_INPUT_FORMATS = ('%d-%m-%Y', '%Y-%m-%d')


# class RegisterUser(UserCreationForm):
#     password1 = forms.CharField(min_length=8, label="Password",
#                                 strip=False,
#                                 validators=[validate_password],
#                                 help_text="Your password must contain atleast one Uppercase letter, one lowercase letter, one digit and symbol!",
#                                 widget=forms.PasswordInput(attrs={'class': 'form-control',
#                                                                   'placeholder': 'Password'}))
#     password2 = forms.CharField(min_length=8, label="Confirm Password",
#                                 strip=False,
#                                 widget=forms.PasswordInput(attrs={'class': 'form-control',
#                                                                   'placeholder': 'Confirm Password'}))

#     class Meta:
#         model = User
#         fields = ('email', 'password1', 'password2')

#         widgets = {
#             'email': forms.TextInput(attrs={'class': 'form-control',
#                                             'placeholder': 'Email'}),
#             # account_type is selected automatically by backend
#         }


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
        fields = ('email', 'account_type')

        widgets = {
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
            'account_type': forms.Select(attrs={'class': 'form-select form-select-lg mb-3', 'aria-label': '.form-select-lg example'})
        }


class Form_employer(forms.ModelForm):
    class Meta:
        model = Employer
        fields = (
            'company',
            'phone1',
            'phone2',
            'address',
            'city',
            'state',
            'zip'
        )

        widgets = {
            'company': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Company name'}),
            'phone1': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Phone number'}),
            'phone2': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Additional phone number'}),
            'address': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '1234 Main St'}),
            'city': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'City'}),
            'state': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'State'}),
            'zip': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Zip'}),
        }


class FormTask(forms.ModelForm):
    class Meta:
        model = Task
        fields = (
            'task', 'description'
        )

        widgets = {
            'task': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Task, Zone, Area'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Describe the work or task'})
        }
