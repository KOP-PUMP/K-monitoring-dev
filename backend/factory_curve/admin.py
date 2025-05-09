from django.contrib import admin
from factory_curve.models import FactoryCurve, FactoryCurveNumber

# Register your models here.

class FactoryCurve_admin(admin.ModelAdmin):
    list_display = [field.name for field in FactoryCurve._meta.fields]
    search_fields = ('fac_number', 'brand', 'model', 'rpm')

admin.site.register(FactoryCurve, FactoryCurve_admin)

class FactoryCurveNumber_admin(admin.ModelAdmin):
    list_display = [field.name for field in FactoryCurveNumber._meta.fields]
    search_fields = ('id','fac_number','brand', 'model', 'rpm')

admin.site.register(FactoryCurveNumber, FactoryCurveNumber_admin)