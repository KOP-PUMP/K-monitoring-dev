from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from pump_data.models import KMonitoringLOV
from pump_data.schema.pump_lov import KMonitoringLOV_schema


@api_controller('/pump-data/', tags=['pump-data'], auth=[JWTAuth()])
class ListOfValuesController:
    @http_get('/KMonitoringLOV', response=list[KMonitoringLOV_schema])
    def get_select_option(self, request, name : str = None,type: str = None):
        query = KMonitoringLOV.objects.all()
        if name:
            query = query.filter(type_name=type)   
        if type:
            query = query.filter(product_name=name)
        return query