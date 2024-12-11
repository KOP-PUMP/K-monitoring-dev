from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from pump_data.models import KMonitoringLOV
from pump_data.schema.pump_lov import KMonitoringLOV_schema
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from uuid import UUID


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

    @http_get('/lov/{id}')
    def get_lov(self, request, id: str):
        uuid_id = UUID(id)
        data = get_object_or_404(KMonitoringLOV, pk=uuid_id)
        data = model_to_dict(data)
        return data

    @http_post('/lov', response=KMonitoringLOV_schema)
    def create_lov(self, request, payload: KMonitoringLOV_schema):
        lov = KMonitoringLOV.objects.create(**payload.dict())
        return lov