from django.contrib import admin
from pump_data.models import KMonitoringLOV, PumpDetailLOV, PumpStandardLOV, MotorDetailLOV, VibrationLOV

# Register your models here.

class KMonitoringLOV_admin(admin.ModelAdmin):
    list_display = ('id','type_name', 'product_name', 'data_value','data_value2','data_value3','data_value4', 'updated_at', 'updated_by', 'created_at', 'created_by')
    search_fields = ('id','type_name', 'product_name', 'data_value','data_value2','data_value3','data_value4')

admin.site.register(KMonitoringLOV, KMonitoringLOV_admin)

class PumpDetailLOV_admin(admin.ModelAdmin):
    list_display = ('id','pump_design', 'pump_type', 'updated_at', 'updated_by', 'created_at', 'created_by')
    search_fields = ('id','pump_design', 'pump_type')

admin.site.register(PumpDetailLOV, PumpDetailLOV_admin)

class PumpStandardLOV_admin(admin.ModelAdmin):
    list_display = ('id','standard_name', 'updated_at', 'updated_by', 'created_at', 'created_by')
    search_fields = ('id','standard_name')

admin.site.register(PumpStandardLOV, PumpStandardLOV_admin)

class MotorDetailLOV_admin(admin.ModelAdmin):
    list_display = ('id','ie_class', 'standard', 'updated_at', 'updated_by', 'created_at', 'created_by')
    search_fields = ('id','ie_class', 'standard')

admin.site.register(MotorDetailLOV, MotorDetailLOV_admin)

class VibrationLOV_admin(admin.ModelAdmin):
    list_display = ('id','voltage', 'acceptable', 'unsatisfied', 'unacceptable', 'updated_at', 'updated_by', 'created_at', 'created_by')
    search_fields = ('id','voltage', 'acceptable', 'unsatisfied', 'unacceptable')

admin.site.register(VibrationLOV, VibrationLOV_admin)
