from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, User_details, Email, Employer, Task, RequestWorker
from django.http import request
import datetime
from django.db.models import Q


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
            'account_type': forms.HiddenInput(),
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


class FormTask(forms.Form):
    task = forms.CharField(widget=forms.TextInput(
        attrs={'class': 'form-control', 'placeholder': 'Task, Zone, Area'}))
    amount = forms.IntegerField(min_value=1, widget=forms.NumberInput(
        attrs={'class': 'form-control', 'placeholder': 'Number of workers'}))
    description = forms.CharField(widget=forms.Textarea(
        attrs={'class': 'form-control', 'placeholder': 'Describe the work or task'}))


class Form_RequestWorker(forms.Form):
    task = forms.CharField(max_length=254, widget=forms.HiddenInput(
        attrs={'class': 'form-control', 'id': 'req-w-task'}))
    amount = forms.IntegerField(widget=forms.NumberInput(
        attrs={'class': 'form-control', 'id': 'req-w-amount', 'min': '1'}))
    start_date = forms.DateField(initial=datetime.date.today, widget=forms.DateInput(
        attrs={'class': 'form-control', 'id': 'req-w-start_date', 'type': 'date'}))
    end_date = forms.DateField(initial=datetime.date.today, widget=forms.DateInput(
        attrs={'class': 'form-control', 'id': 'req-w-end_date', 'type': 'date'}))
    start_time = forms.TimeField(widget=forms.TimeInput(
        attrs={'class': 'form-control', 'id': 'req-w-start_time', 'type': 'time'}))
    end_time = forms.TimeField(widget=forms.TimeInput(
        attrs={'class': 'form-control', 'id': 'req-w-end_time', 'type': 'time'}))
    description = forms.CharField(max_length=600, widget=forms.Textarea(
        attrs={'class': 'form-control text-area_height', 'id': 'req-w-description'}))


class PasswordReset(forms.Form):
    email = forms.CharField(widget=forms.EmailInput(
        attrs={'class': 'form-control'}))
    id = forms.IntegerField(widget=forms.NumberInput(
        attrs={'class': 'form-control'}))
    new_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control'}))
