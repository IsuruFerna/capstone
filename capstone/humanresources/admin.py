from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Task, Employer, Email


class CustomUserAdmin(UserAdmin):
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('account_type',)}),
    )


admin.site.register(User, CustomUserAdmin,)
admin.site.register(Task)
admin.site.register(Employer)
admin.site.register(Email)
