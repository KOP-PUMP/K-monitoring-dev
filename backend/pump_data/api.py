from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from pump_data.models import KMonitoringLOV, PumpDetail, PumpDetailLOV, MotorDetailLOV, ShaftSealLOV, PumpMaterialLOV 
from pump_data.schema.pump_lov import KMonitoringLOV_schema, PumpDetailLOV_schema, PumpDetail_schema, MotorDetailLOV_schema, ShaftSealLOV_schema, PumpMaterialLOV_schema
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from uuid import UUID
from django.http import JsonResponse


@api_controller('/pump-data/', tags=['pump-data'])
class ListOfValuesController:
    @http_get('/data_lov', response=list[KMonitoringLOV_schema])
    def get_select_option(self, request, name : str = None,type: str = None):
        query = KMonitoringLOV.objects.all()
        if name:
            query = query.filter(type_name=type)   
        if type:
            query = query.filter(product_name=name)
        return query
    
    @http_get('/unit_lov', response=list[KMonitoringLOV_schema])
    def get_unit_lov(self, request):
        return KMonitoringLOV.objects.filter(type_name='pump_unit')
    
    @http_get('/pump_lov', response=list[KMonitoringLOV_schema])
    def get_data_lov(self, request):
        return KMonitoringLOV.objects.exclude(type_name='pump_unit')
    
    @http_put('/lov/{id}', response=KMonitoringLOV_schema)
    def update_lov(self, request, id: str, payload: KMonitoringLOV_schema):
        uuid_id = UUID(id)
        data = get_object_or_404(KMonitoringLOV, pk=uuid_id)
        for attr, value in payload.dict(exclude={"id","pk"}).items():
            setattr(data, attr, value) 
        data.save()
        return data

    @http_get('/lov/{id}')
    def get_lov(self, request, id: str):
        uuid_id = UUID(id)
        data = get_object_or_404(KMonitoringLOV, pk=uuid_id)
        data = model_to_dict(data)
        return data

    @http_delete('/lov/{id}')
    def delete_lov(self, request, id: str):
        uuid_id = UUID(id)
        data = get_object_or_404(KMonitoringLOV, pk=uuid_id)
        data.delete()
        return JsonResponse({"success": True, "message": "LOV deleted successfully"}, status=200)

    @http_post('/lov', response=KMonitoringLOV_schema)
    def create_lov(self, request, payload: KMonitoringLOV_schema):
        lov = KMonitoringLOV.objects.create(**payload.dict())
        return lov
    
    @http_post('/pump-detail')
    def create_pump_detail(self, request, payload: PumpDetail_schema):
        PumpDetail.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Pump detail created successfully"}, status=200)
    
    @http_post('/pump-lov')
    def create_pump_lov(self, request, payload: PumpDetailLOV_schema):
        PumpDetailLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Pump LOV created successfully"}, status=200)
    
    @http_post('/motor-lov')
    def create_motor_lov(self, request, payload: MotorDetailLOV_schema):
        MotorDetailLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Motor LOV created successfully"}, status=200)
    
    @http_post('/shaft_seal_lov')
    def create_shaft_seal_lov(self, request, payload: ShaftSealLOV_schema):
        ShaftSealLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Shaft Seal LOV created successfully"}, status=200)
    
    @http_post('/pump-material-lov')
    def create_pump_material_lov(self, request, payload: PumpMaterialLOV_schema):
        PumpMaterialLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Pump Material LOV created successfully"}, status=200)
    
    @http_get('/pump-detail/{id}', response=list[PumpDetail_schema])
    def get_pump_detail(self, request, id: str):
        if id:
            try:
                pump_detail = PumpDetail.objects.get(pump_id=id)
                return JsonResponse({"data": model_to_dict(pump_detail)}, status=200)
            except PumpDetail.DoesNotExist:
                return JsonResponse({"error": "Pump detail not found"}, status=404)
        else:
            pump_details = list(PumpDetail.objects.all().values())  # Converts QuerySet to list of dictionaries
            return JsonResponse({"data": pump_details}, status=200)
    
    @http_get('/pump-lov')
    def get_pump_lov(self, request):
        pump_lov_id = request.GET.get('id')
        if pump_lov_id:
            try:
                uuid_id = UUID(pump_lov_id)
                data = get_object_or_404(PumpDetailLOV, pk=uuid_id)
                data = model_to_dict(data)
                return JsonResponse(data, status=200)
            except PumpDetailLOV.DoesNotExist:
                return JsonResponse({"error": "Pump LOV not found"}, status=404)
        else:
            pump_lovs = list(PumpDetailLOV.objects.all().values())
            return JsonResponse({"data": pump_lovs}, status=200)
    
    @http_get('/motor-lov')
    def get_motor_lov(self, request):
        motor_lov_id = request.GET.get('id')
        if motor_lov_id:
            try:
                motor_lov = MotorDetailLOV.objects.get(motor_id=motor_lov_id)
                return JsonResponse({"data": motor_lov}, status=200)
            except MotorDetailLOV.DoesNotExist:
                return JsonResponse({"error": "Motor LOV not found"}, status=404)
        else:
            motor_lovs = list(MotorDetailLOV.objects.all().values())
            return JsonResponse({"data": motor_lovs}, status=200)
    
    @http_get('/shaft-seal-lov')
    def get_shaft_seal_lov(self, request):
        shaft_seal_lov_id = request.GET.get('id')
        if shaft_seal_lov_id:
            try:
                shaft_seal_lov = ShaftSealLOV.objects.get(shaft_seal_id=shaft_seal_lov_id)
                return JsonResponse({"data": shaft_seal_lov}, status=200)
            except ShaftSealLOV.DoesNotExist:
                return JsonResponse({"error": "Shaft Seal LOV not found"}, status=404)
        else:
            shaft_seal_lovs = list(ShaftSealLOV.objects.all().values())
            return JsonResponse({"data": shaft_seal_lovs}, status=200)
    
    @http_get('/material-lov')
    def get_pump_material_lov(self, request):
        pump_material_lov_id = request.GET.get('id')
        if pump_material_lov_id:
            try:
                pump_material_lov = PumpMaterialLOV.objects.get(material_id=pump_material_lov_id)
                return JsonResponse({"data": pump_material_lov}, status=200)
            except PumpMaterialLOV.DoesNotExist:
                return JsonResponse({"error": "Pump Material LOV not found"}, status=404)
        else:
            pump_material_lovs = list(PumpMaterialLOV.objects.all().values())
            return JsonResponse({"data": pump_material_lovs}, status=200)
    
    @http_delete('/pump-detail/{id}')
    def delete_pump_detail(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(PumpDetail, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Pump detail deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
    
    @http_delete('/pump-lov/{id}')
    def delete_pump_lov(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(PumpDetailLOV, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Pump LOV deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
    
    @http_delete('/motor-lov/{id}')
    def delete_motor_lov(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(MotorDetailLOV, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Motor LOV deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
    
    @http_delete('/shaft-seal-lov/{id}')
    def delete_shaft_seal_lov(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(ShaftSealLOV, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Shaft Seal LOV deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
    
    @http_delete('/material-lov/{id}')
    def delete_pump_material_lov(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(KMonitoringLOV, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Pump Material LOV deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)