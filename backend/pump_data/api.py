from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from pump_data.models import KMonitoringLOV, PumpDetail, PumpDetailLOV, MotorDetailLOV, ShaftSealLOV, PumpMaterialLOV 
from pump_data.schema.pump_lov import KMonitoringLOV_schema, PumpDetailLOV_schema, PumpDetail_schema, MotorDetailLOV_schema, ShaftSealLOV_schema, PumpMaterialLOV_schema
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from uuid import UUID
from django.http import JsonResponse


@api_controller('/pump-data/', tags=['pump-data'], auth=[JWTAuth()])
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
        return KMonitoringLOV.objects.filter(type_name='unit')
    
    @http_get('/pump_lov', response=list[KMonitoringLOV_schema])
    def get_data_lov(self, request):
        return KMonitoringLOV.objects.exclude(type_name='unit')
    
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
    def create_pump_material_lov(self, request, payload: KMonitoringLOV_schema):
        ShaftSealLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Pump Material LOV created successfully"}, status=200)