from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError

from .forms import FormEmployeeDetails, User_email, Form_employer, FormTask
from .models import Email, User, Employer, Task

# Create your views here.


@login_required(login_url="login")
def index(request):
    return render(request, 'humanresources/index.html')


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
                user = User.objects.create_user(username=email,
                                                email=email, password=password)
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

            # form default account_type has setted to employee account type. so we don't have to modify it hereù
            # save email and account_type into db
            email_instance = form_email.save()

            # Email(form_email.email) is a forginKey to form_user_details.user, so we use instances to save correctly
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
        print("User_email: ", form_email)

        # validate form and save into databass
        if form_email.is_valid():
            print('form_email is valid')

            # changing account type to Employer and save
            form_email.account_type = '2'
            email_instance = form_email.save()

            email = form_email.cleaned_data['email']
            print("email: ", email)

            if form.is_valid():
                print("form is valid")

                # save form. since it requred ID because of forginkey, we use 'email_instance'
                company_instance = form.save(commit=False)
                company_instance.email = email_instance
                company_instance.save()

                return HttpResponseRedirect(reverse('index'))

            else:
                print("form isn't valid")
                message = "Something is wrong with the inserted data or the Company already registered. Please recheck the form!"

        else:
            print("form_email isn't valid")
            message = "Email is already taken. Company might already registered!"

        # render site with error messages if any of form isn't valid
        print("passed to render")
        return render(request, "humanresources/addEmployer.html", {
            'message': message,
            'form_employer': Form_employer,
            'form_email': User_email
        })

    return render(request, "humanresources/addEmployer.html", {
        'form_employer': Form_employer(),
        'form_email': User_email()
    })


def work_arrange(request):
    if request.method == 'POST':

        # select the employer to complete the model of Task's manytomany field
        user = Email.objects.get(email=request.user.username)
        employer = Employer.objects.get(email=user)

        form = FormTask(request.POST)

        # validate form and save into database
        if form.is_valid():

            task = Task.objects.create(
                company=employer,
                task=form.cleaned_data['task'],
                description=form.cleaned_data['description']
            )
            task.save()

            return HttpResponseRedirect(reverse('index'))

        else:
            return render(request, "humanresources/workArrange.html", {
                'message': "Something wrong with your inserted data. Please recheck and try again!",
                'form_task': FormTask
            })

    return render(request, "humanresources/workArrange.html", {
        'form_task': FormTask()
    })
