from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'institution', 'department', 'is_teacher', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('institution', 'department', 'is_teacher')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('email', 'institution', 'department', 'is_teacher')}),
    )


admin.site.register(User, CustomUserAdmin)
