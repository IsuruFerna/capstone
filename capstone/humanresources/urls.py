from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),  # available
    path("logout", views.logout_view, name="logout"),  # available
    path("register", views.register, name="register"),  # available
    path("addEmployee", views.add_employee, name="add_employee"),  # available
    path("addEmployer", views.add_employer, name="add_employer"),  # available
    path("employees", views.employees, name="employees"),  # available
    path("employers", views.employers, name="employers"),  # available
    path("arranged", views.arranged_works, name="arrangedWorks"),  # available
    path("setpassword", views.set_password, name="set_password"),  # available


    # API
    path("tasks/created", views.employer_tasks,
         name="employer_tasks"),  # available
    path("tasks/requested", views.requested, name="requested"),  # available
    path("task/requestedWorker", views.requested_workers,
         name="requested_workers"),  # available
    path("task/<int:task_id>", views.available_workers,
         name="availableWorkers"),  # available
    path("workers/<int:requestWorker_id>",
         views.connect_workers, name="connectWorkers"),  # available
    path("worker", views.worker, name="worker"),  # available
    path("cancel-workarrange/<int:task_id>",
         views.cancel_workarrange, name="cancel_workarrange"),  # available
    path("cancel-task/<int:task_id>",
         views.cancel_task, name="cancel_task"),  # available

]
