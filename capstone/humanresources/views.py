from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError

from .forms import RegisterUser, FormEmployeeDetails, User_email
from .models import Email, User

# Create your views here.


@login_required(login_url="login")
def index(request):
    return render(request, 'humanresources/index.html')


def login_view(request):
    if request.method == 'POST':

        # attempt to sign in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

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

        # else return the site with the typed data
        else:
            return render(request, 'humanresources/addEmployee.html', {
                'user_details': FormEmployeeDetails,
                'form_email': User_email
            })

    # otherwise render new forms
    return render(request, 'humanresources/addEmployee.html', {
        'user_details': FormEmployeeDetails(),
        'form_email': User_email()
    })
