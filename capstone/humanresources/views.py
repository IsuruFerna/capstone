from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import Q
import json

from .forms import FormEmployeeDetails, User_email, Form_employer, FormTask, Form_RequestWorker, PasswordReset
from .models import Email, User, Employer, Task, RequestWorker, User_details

# Create your views here.


@login_required(login_url="login")
def index(request):

    # check the worker request form
    if request.method == "POST":

        # get Email -> Employer to save data into RequestWorker table
        user = Email.objects.get(email=request.user.email)
        employer = Employer.objects.get(email=user)

        # forms
        form_req = Form_RequestWorker(
            request.POST, prefix="requestWorkers")
        form = FormTask(request.POST, prefix="taskArrange")

        # this form handle request workers
        if 'requestWorkers' in request.POST:

            if form_req.is_valid():

                # save data into the database
                form_data = RequestWorker(
                    requested_by=employer,
                    task=form_req.cleaned_data['task'],
                    amount=form_req.cleaned_data['amount'],
                    start_date=form_req.cleaned_data['start_date'],
                    end_date=form_req.cleaned_data['end_date'],
                    start_time=form_req.cleaned_data['start_time'],
                    end_time=form_req.cleaned_data['end_time'],
                    description=form_req.cleaned_data['description']
                )
                form_data.save()

                return HttpResponseRedirect(reverse('index'))

            else:
                # retreave with inserted invalid data
                return render(request, 'humanresources/index.html', {
                    'form': form_req
                })

        # this form handle work arrangement/tasks
        if 'taskArrange' in request.POST:

            # validate form and save into database
            if form.is_valid():

                task = Task(
                    company=employer,
                    task=form.cleaned_data['task'],
                    description=form.cleaned_data['description'],
                    amount=form.cleaned_data['amount']
                )
                task.save()

                return HttpResponseRedirect(reverse('index'))

            else:
                return render(request, "humanresources/index.html", {
                    'message': "Something wrong with your inserted data. Please recheck and try again!",
                    'form_task': form
                })

    return render(request, 'humanresources/index.html', {
        'form': Form_RequestWorker(prefix="requestWorkers"),
        'form_task': FormTask(prefix="taskArrange")
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


@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))


@login_required
def set_password(request):
    acc_type = ''

    try:
        acc_type = Email.objects.get(email=request.user.email).account_type
    except ObjectDoesNotExist:
        acc_type = 1

    # only Main accounts can modify the password(accout type = 1)
    if acc_type != 1:
        return HttpResponseRedirect(reverse('index'))

    # validate and reset password
    if request.method == 'POST':

        form = PasswordReset(request.POST)

        if form.is_valid():
            email = form.cleaned_data['email']
            id = form.cleaned_data['id']
            new_password = form.cleaned_data['new_password']
            confirm_password = form.cleaned_data['confirm_password']

            # password validation
            if new_password != confirm_password:
                message = "Password doesn't match with the confirmation"

                return render(request, 'humanresources/passwordSet.html', {
                    'form': form,
                    'message': message
                })

            # user validations
            try:
                Email.objects.get(email=email, id=id)
            except ObjectDoesNotExist:
                message = "There's an issue with the inserted data. Please recheck and try again!"

                return render(request, 'humanresources/passwordSet.html', {
                    'form': form,
                    'message': message
                })

            # set new password
            set_user = User.objects.get(email=email)
            set_user.set_password(new_password)
            set_user.save()

            return HttpResponseRedirect(reverse('index'))

    return render(request, 'humanresources/passwordSet.html', {
        'form': PasswordReset(),
    })


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

            email_instance = form_email.save(commit=False)

            # set account type to employee
            email_instance.account_type = '2'

            # save email and account_type into db
            email_instance.save()

            # Email(form_email.email) is a forginKey to form_user_details.user, so we use instances to save correctly
            if form_user_details.is_valid():
                user_details_instance = form_user_details.save(commit=False)
                user_details_instance.user = email_instance
                user_details_instance.save()

                print("employee saved")
                return HttpResponseRedirect(reverse('index'))

            else:
                message = "Something is wrong with the inserted data. Please recheck the form!"

        else:
            print(form_email.errors)
            message = "Email is already taken!"

        # render site with error messages if any of form isn't valid
        return render(request, 'humanresources/addEmployee.html', {
            'message': message,
            'user_details': form_user_details,
            'form_email': form_email
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
            email_instance = form_email.save(commit=False)
            email_instance.account_type = '3'
            email_instance.save()

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


@login_required
def employees(request):
    email = Email.objects.filter(account_type='2')
    all_employees = User_details.objects.filter(user__in=email)

    return render(request, "humanresources/employees.html", {
        "employee_detail": all_employees
    })


@login_required
def employers(request):
    email = Email.objects.filter(account_type='3')
    all_employers = Employer.objects.filter(email__in=email)

    return render(request, "humanresources/employers.html", {
        "employer_detail": all_employers
    })


def work_arrange(request):

    if request.method == 'POST':

        # select the employer to complete the model Task
        user = Email.objects.get(email=request.user.email)
        employer = Employer.objects.get(email=user)

        form = FormTask(request.POST)

        # validate form and save into database
        if form.is_valid():

            task = Task(
                company=employer,
                task=form.cleaned_data['task'],
                description=form.cleaned_data['description'],
                amount=form.cleaned_data['amount']
            )
            task.save()
            print("saved successfully", task)

            return HttpResponseRedirect(reverse('index'))

        else:
            return render(request, "humanresources/workArrange.html", {
                'message': "Something wrong with your inserted data. Please recheck and try again!",
                'form_task': FormTask
            })

    return render(request, "humanresources/workArrange.html", {
        'form_task': FormTask()
    })


# @csrf_exempt
@login_required
def employer_tasks(request):
    # select the employer to complete the model Task

    # make sure it doesn't return null by try
    user = Email.objects.get(email=request.user.username)
    employer = Employer.objects.get(email=user)
    tasks = Task.objects.filter(company=employer)

    # tasks = tasks.order_by("-timestamp").all()
    return JsonResponse([task.serialize() for task in tasks], safe=False)


@csrf_exempt
@login_required
def requested(request):

    # get the employer and their requests for work
    user = Email.objects.get(email=request.user.email)
    employer = Employer.objects.get(email=user)
    requested_workers = RequestWorker.objects.filter(
        requested_by=employer, filled=False)

    print("requested employer id", employer)
    return JsonResponse([requested_worker.serialize() for requested_worker in requested_workers], safe=False)


@csrf_exempt
@login_required
def requested_workers(request):
    # works = RequestWorker.objects.all()
    works = RequestWorker.objects.filter(filled=False)
    return JsonResponse([work.serialize() for work in works], safe=False)


@csrf_exempt
@login_required
def available_workers(request, task_id):

    task = RequestWorker.objects.get(pk=task_id)
    end_date = task.end_date

    # account type must be 2 which means workers
    # they must be not include in any RequestWorker model or those who included one's start day must be less than current RequestWorker's end date
    available = Email.objects.filter(
        Q(account_type='2', workers__start_date__lt=end_date) | Q(
            workers__isnull=True, account_type='2')
    )

    return JsonResponse([worker.serialize() for worker in available], safe=False)


@login_required
@csrf_exempt
def connect_workers(request, requestWorker_id):

    # getting workers IDs must be post
    if request.method != 'POST':
        return JsonResponse({"error": "Post request Required!"}, status=400)

    # retreaving data
    data = json.loads(request.body)
    workers = data.get("workers", "")
    task = RequestWorker.objects.get(id=requestWorker_id)
    max_workers_amount = task.amount - task.workers.count()
    print(max_workers_amount, requestWorker_id, workers)

    # user can not add more than required workers amount
    if len(workers) > max_workers_amount:
        return JsonResponse({"error": "user can't add more than required amount"}, status=400)

    # adding workers to RequestWorker table
    employee = Email.objects.filter(id__in=workers)
    task.workers.set(employee)

    if task.workers.count() == task.amount:
        task.filled = True

    task.save()

    print(task.workers.count())

    return JsonResponse({"message": "Workers connected to task successfully"}, status=201)


@login_required
@csrf_exempt
def cancel_workarrange(request, task_id):

    task = RequestWorker.objects.get(pk=task_id)

    # cancel task/ deleting the task
    if request.method == 'DELETE':
        task.delete()

        return JsonResponse({"state": "successfully Deleted task request!"})

    elif request.method == 'PUT':
        # load data
        data = json.loads(request.body)
        filled = data.get("filled", "")

        # set filled to false and remove workers from the model
        task.filled = filled
        task.workers.clear()
        task.save()

        print("this is data", filled, task)
        return JsonResponse({"status": "successfully dismissed task request!"})
        # return HttpResponseRedirect(reverse('index'))

    return JsonResponse({"error": "Delete method required!"})


@login_required
@csrf_exempt
def cancel_task(request, task_id):

    # retreaving data and delete task
    if request.method == 'DELETE':
        task = Task.objects.get(pk=task_id)
        task.delete()

        return JsonResponse({"status": "Task successfully cancelled!"})

    return JsonResponse({"error": "Required DELETE request!"})


@login_required
@csrf_exempt
def worker(request):
    # retreave available works to the employee
    tasks = Email.objects.get(email=request.user.email)
    works = RequestWorker.objects.filter(workers=tasks, filled=False)

    return JsonResponse([work.serialize() for work in works], safe=False)


@login_required
def arranged_works(request):
    tasks = RequestWorker.objects.filter(filled=True)

    return render(request, 'humanresources/arrangedWork.html', {
        "tasks": tasks
    })


@login_required
@csrf_exempt
def employer_details(request, workerRequest_id):
    employer_task = RequestWorker.objects.get(pk=workerRequest_id)

    return JsonResponse([employer.serialize() for employer in employer_task])
