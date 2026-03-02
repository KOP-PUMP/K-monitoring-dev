import logging

from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission
from django.contrib.auth import get_user_model
import uuid

logger = logging.getLogger(__name__)

class CustomUserManager(BaseUserManager):
    def create_user(self, user_email: str, user_username: str, user_password: str, user_role: str, **extra_fields) -> 'CustomUser':
        if not user_email:
            raise ValueError('The Email field must be set')

        user_email = self.normalize_email(user_email)
        user = self.model(user_email=user_email, user_username=user_username, user_role=user_role, **extra_fields)

        try:
            extra_fields.setdefault('is_staff', True)
            user.set_password(user_password)
            user.save(using=self._db)
            logger.info(f'User {user_username} created successfully.')
            return user
        except Exception as e:
            logger.error(f'Error creating user {user_username}: {e}')
            raise ValidationError(f'Error creating user: {e}')

    def create_superuser(self, user_email: str, user_username: str, user_password: str,user_role: str, **extra_fields) -> 'CustomUser':
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(user_email, user_username, user_password,user_role, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    user_username = models.CharField(max_length=50, unique=True)
    user_email = models.EmailField(_('email address'), unique=True)
    user_role = models.CharField(choices=[('Admin', 'Admin'), ('Developer', 'Developer'),('Sales', 'Sales'), ('Service', 'Service'), ('Engineer', 'Engineer'), ('Customer', 'Customer')], max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'user_email'
    REQUIRED_FIELDS = ['user_username']

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text=_('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        verbose_name=_('groups'),
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text=_('Specific permissions for this user.'),
        verbose_name=_('user permissions'),
    )

    class Meta:
        db_table = 'tbl_user'

    def __str__(self):
        return self.user_username



class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    user_mobile = models.CharField(max_length=30, blank=True, null=True)
    user_tel = models.CharField(max_length=30, blank=True, null=True)
    user_name = models.CharField(max_length=50, blank=True, null=True)
    user_pec_code = models.CharField(max_length=50, blank=True, null=True)
    user_company_code = models.CharField(max_length=50, blank=True, null=True)
    created_by = models.CharField(max_length=100 , blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_by = models.CharField(max_length=100 , blank=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        db_table = 'tbl_user_profiles'

    def __str__(self):
        return f"{self.user.user_username}'s Profile"


class CompaniesDetail(models.Model):
    company_id= models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4) 
    customer_code = models.CharField(max_length=100 , blank=False, null=False)
    customer_industry_id = models.CharField(max_length=100 , blank=True, null=True)
    customer_industry_group = models.CharField(max_length=100 , blank=True, null=True)
    company_name_en = models.CharField(max_length=100 , blank=False, null=False)
    address_en = models.CharField(max_length=1000 , blank=False, null=False)
    company_name_th = models.CharField(max_length=100 , blank=False, null=False)
    address_th = models.CharField(max_length=1000,blank=False, null=False)
    map = models.CharField(max_length=100 , blank=True, null=True)  
    province = models.CharField(max_length=100 , blank=False, null=False)
    sales_area = models.CharField(max_length=100 , blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    class Meta:
        db_table = 'tbl_company_detail'
    def __str__(self):
        return self.customer_code
    