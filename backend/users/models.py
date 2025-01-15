import logging

from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission
import uuid

logger = logging.getLogger(__name__)

class CustomUserManager(BaseUserManager):
    def create_user(self, email: str, username: str, password: str, **extra_fields) -> 'CustomUser':
        if not email:
            raise ValueError('The Email field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)

        try:
            user.set_password(password)
            user.save(using=self._db)
            logger.info(f'User {username} created successfully.')
            return user
        except Exception as e:
            logger.error(f'Error creating user {username}: {e}')
            raise ValidationError(f'Error creating user: {e}')

    def create_superuser(self, email: str, username: str, password: str, **extra_fields) -> 'CustomUser':
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(_('email address'), unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

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
        db_table = 'tbl_users_lov'

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'tbl_users_lov'

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=30)
    phone = models.CharField(max_length=30)
    surname = models.CharField(max_length=50, blank=True, null=True)
    lastname = models.CharField(max_length=50, blank=True, null=True)
    user_customer = models.CharField(max_length=100, blank=True, null=True)
    user_address = models.CharField(max_length=50, blank=True, null=True)
    user_image = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        db_table = 'tbl_user_profiles'

    def __str__(self):
        return f"{self.user.username}'s Profile"

class CompaniesDetail(models.Model):
    customer_id= models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4) 
    customer_code = models.CharField(max_length=100 , blank=False, null=False)
    customer_industry_id = models.CharField(max_length=100 , blank=False, null=False)
    customer_industry_group = models.CharField(max_length=100 , blank=False, null=False)
    company_name_en = models.CharField(max_length=100 , blank=False, null=False)
    address_en = models.CharField(max_length=100 , blank=False, null=False)
    company_name_th = models.CharField(max_length=100 , blank=False, null=False)
    address_th = models.CharField(max_length=100 , blank=False, null=False)
    map = models.CharField(max_length=100 , blank=False, null=False)  
    province_th = models.CharField(max_length=100 , blank=False, null=False)
    province_en = models.CharField(max_length=100 , blank=False, null=False)
    sales_area = models.CharField(max_length=100 , blank=False, null=False)
    created_by = models.CharField(max_length=100 , blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.CharField(max_length=100 , blank=False, null=False)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tbl_company_detail'
    def __str__(self):
        return self.customer_code
    
class ContactPersonDetail(models.Model):
    contact_person_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    customer_code = models.CharField(max_length=100 , blank=False, null=False)
    name_surname_en = models.CharField(max_length=100 , blank=False, null=False)
    name_surname_th = models.CharField(max_length=100 , blank=False, null=False)
    position_en = models.CharField(max_length=100 , blank=False, null=False)
    position_th = models.CharField(max_length=100 , blank=False, null=False)
    tel = models.CharField(max_length=100 , blank=False, null=False)
    mobile = models.CharField(max_length=100 , blank=False, null=False)
    email = models.CharField(max_length=100 , blank=False, null=False)
    time_stamp = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tbl_contact_person_detail'
    def __str__(self):
        return self.name_surname_en