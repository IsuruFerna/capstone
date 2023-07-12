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

from .forms import FormEmployeeDetails, User_email, Form_employer, FormTask, Form_RequestWorker
from .models import Email, User, Employer, Task, RequestWorker

# Create your views here.


@login_required(login_url="login")
def index(request):
    print("this is index")

    # check the worker request form
    if request.method == "POST":

        # to prevent unnecessary codes when 'connectWorkersWithTasks'
        if 'connectWorkersWithTasks' not in request.POST:

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

        # connect workers with tasks(RequestWorker model)
        if 'connectWorkersWithTasks' in request.POST:

            # gettings the list of IDs of selected workers
            values = request.POST.getlist('name-check-box')
            print("now we are saving connectWorkersWithTasks", values)

            # I have to do manual validation
            return HttpResponseRedirect(reverse('index'))

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
    requested_workers = RequestWorker.objects.filter(requested_by=employer)

    print("requested employer id", employer)
    return JsonResponse([requested_worker.serialize() for requested_worker in requested_workers], safe=False)


@csrf_exempt
@login_required
def requested_workers(request):
    works = RequestWorker.objects.all()
    return JsonResponse([work.serialize() for work in works], safe=False)


def available_workers(request, task_id):
    # this_task = RequestWorker.objects.get(pk=task_id)
    # tasks = RequestWorker.objects.all()
    all_workers = Email.objects.all()

    task = RequestWorker.objects.get(pk=task_id)
    print("this is workers", task.workers)
    workers = Email.objects.filter(account_type='2')

    # get workers who are available for work that they haven't any relationship with requestWorker model
    workers = Email.objects.filter(
        Q(workers__isnull=True, account_type='2')
    )

    print("these are workers", workers)
    available_workers = workers

    # available_workers = all_workers

    # start_date = this_task.start_date
    # end_date = this_task.end_date

    # # start_days = tasks.start_date
    # for task in tasks:
    #     day_start = task.start_date
    #     day_end = task.end_date

    #     if day_start <= start_date <= day_end or day_start <= end_date <= day_end:
    #         available_workers = available_workers.exclude(
    #             pk__in=task.workers.values_list('pk', flat=True))

    #         # print('these are the available workers')

    # for worker in available_workers:
    #     print(worker)
    # start_date = task.start_date
    # end_date = task.end_date

    # tasks = RequestWorker.objects.all()
    # workers = Email.objects.filter(account_type='2').distinct()

    # available = Email.objects.filter(
    #     Q(requestworker__isnull=True, requestworker__pk=task_id) |
    #     ~Q(requestworker__start_date__lte=end_date,
    #        requestworker__end_date__gte=start_date)
    # )

    # # converting dates to required format
    # def convert_date_format(date):
    #     parse_date_string = datetime.strptime(date, "%b, %d, %Y")
    #     formated__date = parse_date_string.strftime("%Y, %m, %d")
    #     return formated__date

    # available_workers = available

    # # if workers are not already in the RequestedWorker object
    # if not workers in related_workers:
    #     print("we found some")
    #     # they can be added without problem

    #     # but we need to check their availability
    #     if workers in tasks:
    #         tasks.start_date

    #         start_date = tasks.start_date
    #         end_date = tasks.end_date
    #         start_time = tasks.start_time
    #         end_time = tasks.end_time

    #         # task.start_date__range[start_date, end_date]
    #         # task.end_date__range[start_date, end_date]

    #         print("time")

    # else:
    #     print("there arn't related workers", tasks.start_time, tasks.end_time)
    # available_workers = workers

    # I want to get the time and dates and check availability. ckeck the last date

    # get available employee
    # available_workers = Email.objects.filter(
    #     Q(account_type='2'), )
    # print(tasks, available_workers)
    return JsonResponse([worker.serialize() for worker in available_workers], safe=False)
