from django.contrib import admin
from factory_curve.models import FactoryCurve

# Register your models here.

class FactoryCurve_admin(admin.ModelAdmin):
    list_display = [field.name for field in FactoryCurve._meta.fields]
    search_fields = ('fac_number', 'brand', 'model', 'rpm')

admin.site.register(FactoryCurve, FactoryCurve_admin)
