from django.contrib import admin
from engineer.models import EngineerReport

# Register your models here.
class EngineerReport_admin(admin.ModelAdmin):
    list_display = [field.name for field in EngineerReport._meta.fields]
    search_fields = ('pump_detail__pump_code_name', 'pump_detail__company_code', 'user_detail__user_name', 'user_detail__user__user_email')

admin.site.register(EngineerReport, EngineerReport_admin)
