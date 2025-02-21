from django.contrib import admin
from pump_data.models import KMonitoringLOV, PumpDetailLOV, MotorDetailLOV, ShaftSealLOV, PumpMaterialLOV, PumpDetail

# Register your models here.

class KMonitoringLOV_admin(admin.ModelAdmin):
    list_display = ('id','type_name', 'product_name', 'data_value','data_value2','data_value3','data_value4', 'updated_at', 'updated_by', 'created_at', 'created_by')
    search_fields = ('id','type_name', 'product_name', 'data_value','data_value2','data_value3','data_value4')

admin.site.register(KMonitoringLOV, KMonitoringLOV_admin)

class PumpDetailLOV_admin(admin.ModelAdmin):
    list_display = [field.name for field in PumpDetailLOV._meta.fields]
    search_fields = ('pump_lov_id','pump_brand', 'pump_model', 'pump_design', 'pump_type')

admin.site.register(PumpDetailLOV, PumpDetailLOV_admin)

class MotorDetailLOV_admin(admin.ModelAdmin):
    list_display = [field.name for field in MotorDetailLOV._meta.fields]
    search_fields = ('motor_id','motor_model', 'motor_serial_no', 'motor_brand', 'motor_standard')

admin.site.register(MotorDetailLOV, MotorDetailLOV_admin)

class ShaftSealLOV_admin(admin.ModelAdmin):
    list_display = [field.name for field in ShaftSealLOV._meta.fields]
    search_fields = ('shaft_seal_id','shaft_seal_design', 'shaft_seal_brand', 'shaft_seal_model')

admin.site.register(ShaftSealLOV, ShaftSealLOV_admin)

class PumpMaterialLOV_admin(admin.ModelAdmin):
    list_display = [field.name for field in PumpMaterialLOV._meta.fields]
    search_fields = ('material_id','pump_type_mat')

admin.site.register(PumpMaterialLOV, PumpMaterialLOV_admin)

class PumpDetail_admin(admin.ModelAdmin):
    list_display = [field.name for field in PumpDetail._meta.fields]
    search_fields = ('pump_id', 'company_code', 'pump_status')

admin.site.register(PumpDetail, PumpDetail_admin)