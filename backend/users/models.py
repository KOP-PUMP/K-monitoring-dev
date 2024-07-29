import logging

from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission

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
