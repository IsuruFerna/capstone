from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("addEmployee", views.add_employee, name="add_employee"),
    path("addEmployer", views.add_employer, name="add_employer"),
    path("workArrange", views.work_arrange,
         name="work_arrange"),  # not available
    path("employees", views.employees, name="employees"),
    path("employers", views.employers, name="employers"),
    path("arranged", views.arranged_works, name="arrangedWorks"),


    # API
    path("tasks/created", views.employer_tasks, name="employer_tasks"),
    path("tasks/requested", views.requested, name="requested"),
    path("task/requestedWorker", views.requested_workers,
         name="requested_workers"),  # not available
    path("task/<int:task_id>", views.available_workers, name="availableWorkers"),
    path("workers/<int:requestWorker_id>",
         views.connect_workers, name="connectWorkers"),
    path("worker", views.worker, name="worker"),
    path("worker/<int:workerRequest_id>",
         views.employer_details, name="employerDetails"),
    path("cancel-workarrange/<int:task_id>",
         views.cancel_workarrange, name="cancel_workarrange"),
    path("cancel-task/<int:task_id>",
         views.cancel_task, name="cancel_task"),

]
