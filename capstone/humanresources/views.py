from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError

from .forms import RegisterUser, FormEmployeeDetails, User_email, Form_employer
from .models import Email, User

# Create your views here.


@login_required(login_url="login")
def index(request):

    return render(request, 'humanresources/index.html', {
        "account_type": Email.objects.get(email=request.user.username).account_type
    })


def login_view(request):
    if request.method == 'POST':

        # attempt to sign in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, email=email, password=password)

        # check if the authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))

        else:
            return render(request, 'humanresources/login.html', {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, 'humanresources/login.html')


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))


def search(request):
    return render(request, "humanresources/search.html")


def register(request):

    if request.method == 'POST':
        email = request.POST["email"]
        # check if the email is already listed, if so user able to register to the website
        try:
            Email.objects.get(email=email)
            able = True
        except ObjectDoesNotExist:
            able = False
            message = "You can't register to this website. Please contact authority for more info!"

        if able:
            # Ensure password matches confirmation
            password = request.POST["password"]
            confirmation = request.POST["confirmation"]
            if password != confirmation:
                return render(request, 'humanresources/register.html', {
                    'message': "Passwords must match."
                })

            # Attempt to create new user
            try:
                user = User.objects.create_user(email, password)
                user.save()
            except IntegrityError:
                return render(request, "network/register.html", {
                    "message": "Username already taken."
                })
            login(request, user)

            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, "humanresources/register.html", {
                'message': message
            })

    return render(request, 'humanresources/register.html')


def add_employee(request):

    if request.method == "POST":
        form_email = User_email(request.POST)
        form_user_details = FormEmployeeDetails(request.POST)

        # data validation to save in database
        if form_email.is_valid():
            email_instance = form_email.save()

            # email has used as forginKey to form_user_details
            if form_user_details.is_valid():
                user_details_instance = form_user_details.save(commit=False)
                user_details_instance.user = email_instance
                user_details_instance.save()

                return HttpResponseRedirect(reverse('index'))

            else:
                message = "Something is wrong with the inserted data. Please recheck the form!"

        else:
            message = "Email is already taken!"

        # render site with error messages if any of form isn't valid
        return render(request, 'humanresources/addEmployee.html', {
            'message': message,
            'user_details': FormEmployeeDetails,
            'form_email': User_email
        })

    # otherwise render new forms
    return render(request, 'humanresources/addEmployee.html', {
        'user_details': FormEmployeeDetails(),
        'form_email': User_email()
    })


def add_employer(request):
    if request.method == "POST":
        form = Form_employer(request.POST)
        form_email = User_email(request.POST)

        # validate form and save into databass
        if form_email.is_valid():

            if form.is_valid():

                # changing account type to Employer and save
                form_email.account_type = '2'
                email_instance = form_email.save()

                # save form. since it requred ID because of forginkey, we use 'email_instance'
                company_instance = form.save(commit=False)
                company_instance.email = email_instance
                company_instance.save()

                return HttpResponseRedirect(reverse('index'))

            else:
                message = "Something is wrong with the inserted data or the Company already registered. Please recheck the form!"

        else:
            message = "Email is already taken. Company might already registered!"

        # render site with error messages if any of form isn't valid
        return render(request, "humanresources/addEmployer.html", {
            'message': message,
            'form_employer': Form_employer,
            'form_email': User_email
        })

    return render(request, "humanresources/addEmployer.html", {
        'form_employer': Form_employer(),
        'form_email': User_email()
    })
