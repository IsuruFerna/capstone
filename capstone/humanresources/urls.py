from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("search", views.search, name="search"),
    path("register", views.register, name="register"),
    path("addEmployee", views.add_employee, name="add_employee"),
    path("addEmployer", views.add_employer, name="add_employer"),
    path("workArrange", views.work_arrange, name="work_arrange"),


    # API
    path("tasks", views.employer_tasks, name="employer_tasks"),
    path("requested/<int:acc_id>", views.requested, name="requested"),

]
