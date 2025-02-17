from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Permission
from users.models import CompaniesDetail

from .models import CustomUser, UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'profile'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    
    fieldsets = (
        (None, {'fields': ('user_username', 'user_email')}),
        (_('Important dates'), {'fields': ('last_login',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('user_username', 'user_email', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )
    
    list_display = ('user_username', 'user_email', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('user_username', 'user_email')
    ordering = ('user_username',)

admin.site.register(Permission)
admin.site.register(CustomUser, UserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user','user_name','user_pec_code','user_pec_code', 'user_role', 'user_mobile','created_by','created_at','updated_by','updated_at')
    search_fields = ('user__user_username', 'user_role')
    ordering = ('user__user_username',)

class CompaniesDetail_Admin(admin.ModelAdmin):
    list_display = ('customer_id', 'customer_code', 'customer_industry_id', 'customer_industry_group', 'company_name_en', 'address_en', 'company_name_th', 'address_th', 'map', 'province', 'sales_area', 'created_by', 'created_at', 'updated_by', 'updated_at')
    search_fields = ('customer_code','customer_industry_group', 'company_name_en', 'company_name_th')
admin.site.register(CompaniesDetail, CompaniesDetail_Admin)
