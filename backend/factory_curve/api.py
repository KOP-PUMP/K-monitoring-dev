from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from factory_curve.models import FactoryCurve, FactoryCurveNumber
from factory_curve.schema.factory_curve import FactoryCurve_schema, FactoryCurveNumber_schema
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from uuid import UUID
from django.http import JsonResponse

@api_controller('/factory-curve/', tags=['factory_curve'], auth=JWTAuth())
class FactoryCurveController:
    @http_get('/data/{factory_no}', response=list[FactoryCurve_schema])
    def get_factory_curve(self, request, factory_no: str):
        data = list(FactoryCurve.objects.filter(fac_number=factory_no))  # Convert QuerySet to a list

        if not data:  # Check if the list is empty
            return JsonResponse({"error": "Factory curve not found 2 "}, status=404)

        serialized_data = [model_to_dict(item) for item in data]  # Convert each model instance to a dictionary
        return JsonResponse(serialized_data, safe=False, status=200)  # Return list of results
    @http_get('/number', response=list[FactoryCurveNumber_schema])
    def get_factory_curve_number(self, request):
        data = list(FactoryCurveNumber.objects.all().values())
        return JsonResponse({"data": data}, status=200)