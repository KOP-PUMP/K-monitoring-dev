from django.contrib import admin
from engineer.models import EngineerReport , EngineerReportCheck, EngineerReportCheckCal, EngineerReportCheckVibration, EngineerReportCheckVisual, EngineerReportCheckResult

# Register your models here.
class EngineerReport_admin(admin.ModelAdmin):
    list_display = [field.name for field in EngineerReport._meta.fields]
    search_fields = ('pump_detail__pump_code_name', 'pump_detail__company_code', 'user_detail__user_name', 'user_detail__user__user_email')

admin.site.register(EngineerReport, EngineerReport_admin)

class EngineerReportCheck_admin(admin.ModelAdmin):
    list_display = [field.name for field in EngineerReportCheck._meta.fields]
    search_fields = ('doc_customer', 'doc_no', 'doc_number_engineer')

admin.site.register(EngineerReportCheck, EngineerReportCheck_admin)

class EngineerReportCheckCal_admin(admin.ModelAdmin):
    list_display = [field.name for field in EngineerReportCheckCal._meta.fields]

admin.site.register(EngineerReportCheckCal, EngineerReportCheckCal_admin)

class EngineerReportCheckVibration_admin(admin.ModelAdmin):
    list_display = [field.name for field in EngineerReportCheckVibration._meta.fields]

admin.site.register(EngineerReportCheckVibration, EngineerReportCheckVibration_admin)

class EngineerReportCheckVisual_admin(admin.ModelAdmin):
    list_display = [field.name for field in EngineerReportCheckVisual._meta.fields]

admin.site.register(EngineerReportCheckVisual, EngineerReportCheckVisual_admin)


class EngineerReportCheckResult_admin(admin.ModelAdmin):
    list_display = [field.name for field in EngineerReportCheckResult._meta.fields]

admin.site.register(EngineerReportCheckResult, EngineerReportCheckResult_admin)
