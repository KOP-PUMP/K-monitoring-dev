from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser

class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('user_name', 'user_password')}),
        (_('Personal info'), {'fields': ('user_email', 'surname', 'lastname', 'user_phone', 'user_customer', 'user_address', 'user_image')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('user_name', 'user_email', 'user_password1', 'user_password2'),
        }),
    )
    list_display = ('user_name', 'user_email', 'is_staff')
    search_fields = ('user_name', 'user_email')
    ordering = ('user_name',)

admin.site.register(CustomUser, UserAdmin)
