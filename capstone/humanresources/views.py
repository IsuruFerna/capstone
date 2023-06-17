from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse

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
    return render(request, 'humanresources/register.html')
