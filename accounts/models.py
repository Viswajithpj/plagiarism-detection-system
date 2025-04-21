from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Custom user model with additional fields for teachers/professors"""
    
    email = models.EmailField(_('email address'), unique=True)
    institution = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=255, blank=True)
    is_teacher = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
