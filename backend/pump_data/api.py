from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from pump_data.models import KMonitoringLOV, PumpDetail, PumpDetailLOV, MotorDetailLOV, ShaftSealLOV, PumpMaterialLOV, MediaLOV
from users.models import CompaniesDetail
from pump_data.schema.pump_lov import KMonitoringLOV_schema, PumpDetailLOV_schema, PumpDetail_schema, MotorDetailLOV_schema, ShaftSealLOV_schema, PumpMaterialLOV_schema, MediaLOV_schema
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from uuid import UUID
from django.http import JsonResponse


@api_controller('/pump-data/', tags=['pump-data'])
class ListOfValuesController:

    # Pump Detail API
    @http_post('/pump-detail')
    def create_pump_detail(self, request, payload: PumpDetail_schema):
        try:
            payload_dict = payload.dict()
            company_instance = CompaniesDetail.objects.get(company_id=payload_dict.get('company_id'))
            pump_lov_instance = PumpDetailLOV.objects.get(pump_lov_id=payload_dict.get('pump_lov_id'))
            media_lov_instance = MediaLOV.objects.get(media_lov_id=payload_dict.get('media_lov_id'))
            mat_lov_instance = PumpMaterialLOV.objects.get(mat_lov_id=payload_dict.get('mat_lov_id'))
            motor_lov_instance = MotorDetailLOV.objects.get(motor_lov_id=payload_dict.get('motor_lov_id'))
            shaft_seal_lov_instance = ShaftSealLOV.objects.get(shaft_seal_lov_id=payload_dict.get('shaft_seal_lov_id'))

            payload_dict.update({
                'company_id' : company_instance,
                'pump_lov_id' : pump_lov_instance,
                'media_lov_id' : media_lov_instance,
                'mat_lov_id' : mat_lov_instance,
                'motor_lov_id' : motor_lov_instance,
                'shaft_seal_lov_id' : shaft_seal_lov_instance
            })
            PumpDetail.objects.create(**payload_dict)
            return JsonResponse({"success": True, "message": f"Pump detail created successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Error creating pump detail"}, status=400)
        
    @http_get('/pump-detail')
    def get_pump_detail(self, request):
        pump_id = request.GET.get('id')
        if pump_id:
            try:
                uuid_id = UUID(pump_id)
                data = get_object_or_404(PumpDetail, pk=uuid_id)
                data = model_to_dict(data)
                return JsonResponse(data, status=200)
            except PumpDetail.DoesNotExist:
                return JsonResponse({"error": "Pump not found"}, status=404)
        else:
            pump_detail = list(PumpDetail.objects.all().values())
            return JsonResponse({"data": pump_detail}, status=200)


    @http_delete('/pump-detail/{id}')
    def delete_pump_detail(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(PumpDetail, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Pump detail deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)

    #K-monitoring LOV
    @http_get('/data-lov', response=list[KMonitoringLOV_schema])
    def get_select_option(self, request, name : str = None,type: str = None):
        query = KMonitoringLOV.objects.all()
        if name:
            query = query.filter(type_name=type)   
        if type:
            query = query.filter(product_name=name)
        return query
    
    @http_get('/unit-lov', response=list[KMonitoringLOV_schema])
    def get_unit_lov(self, request):
        return KMonitoringLOV.objects.filter(type_name='pump_unit')
    
    @http_get('/pump-lov', response=list[KMonitoringLOV_schema])
    def get_data_lov(self, request):
        return KMonitoringLOV.objects.exclude(type_name='pump_unit')
    
    @http_put('/lov/{id}', response=KMonitoringLOV_schema)
    def update_lov(self, request, id: str, payload: KMonitoringLOV_schema):
        uuid_id = UUID(id)
        data = get_object_or_404(KMonitoringLOV, pk=uuid_id)
        for attr, value in payload.dict(exclude_unset=True).items():
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
    
    @http_post('/pump-lov')
    def create_pump_lov(self, request, payload: PumpDetailLOV_schema):
        PumpDetailLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Pump LOV created successfully"}, status=200)
        
    # Pump Detail LOV API
    @http_get('/pump-detail-lov')
    def get_pump_detail_lov(self, request):
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
        
    @http_post('/pump-detail-lov')
    def create_pump_detail_lov(self, request, payload: PumpDetailLOV_schema):
        try:
            PumpDetailLOV.objects.create(**payload.dict())
            return JsonResponse({"success": True, "message": "Pump detail LOV created successfully"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    @http_put('/pump-detail-lov/{id}', response=PumpDetailLOV_schema)
    def update_pump_detail_lov(self, request, id: str, payload: PumpDetailLOV_schema):
        uuid_id = UUID(id)
        data = get_object_or_404(PumpDetailLOV, pk=uuid_id)
        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(data, attr, value) 
        data.save()
        return data
    
    @http_delete('/pump-detail-lov/{id}')
    def delete_pump_detail_lov(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(PumpDetailLOV, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Pump detail LOV deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
    
    # Media Detail LOV API

    @http_get('/media-lov')
    def get_media_lov(self, request):
        media_lov_id = request.GET.get('id')
        if media_lov_id:
            try:
                uuid_id = UUID(media_lov_id)
                data = get_object_or_404(MediaLOV, pk=uuid_id)
                data = model_to_dict(data)
                return JsonResponse(data, status=200)
            except MediaLOV.DoesNotExist:
                return JsonResponse({"error": "Media LOV not found"}, status=404)
        else:
            media_lovs = list(MediaLOV.objects.all().values())
            return JsonResponse({"data": media_lovs}, status=200)

    @http_post('/media-lov')
    def create_media_lov(self, request, payload: MediaLOV_schema):
        MediaLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Media LOV created successfully"}, status=200)
    
    @http_put('/media-lov/{id}', response=MediaLOV_schema)
    def update_media_lov(self, request, id: str, payload: MediaLOV_schema):
        uuid_id = UUID(id)
        data = get_object_or_404(MediaLOV, pk=uuid_id)
        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(data, attr, value) 
        data.save()
        return data
    
    @http_delete('/media-lov/{id}')
    def delete_media_lov(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(MediaLOV, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Media LOV deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
        
    # Motor Detail LOV API
    @http_get('/motor-lov')
    def get_motor_lov(self, request):
        motor_lov_id = request.GET.get('id')
        if motor_lov_id:
            try:
                motor_lov = MotorDetailLOV.objects.get(motor_lov_id=motor_lov_id)
                return JsonResponse({"data": model_to_dict(motor_lov)}, status=200)
            except MotorDetailLOV.DoesNotExist:
                return JsonResponse({"error": "Motor LOV not found"}, status=404)
        else:
            motor_lovs = list(MotorDetailLOV.objects.all().values())
            return JsonResponse({"data": motor_lovs}, status=200)
        
    @http_put('/motor-lov/{id}', response=MotorDetailLOV_schema)
    def update_motor_lov(self, request, id: str, payload: MotorDetailLOV_schema):
        uuid_id = UUID(id)
        data = get_object_or_404(MotorDetailLOV, pk=uuid_id)
        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(data, attr, value) 
        data.save()
        return data
        
    @http_post('/motor-lov')
    def create_motor_lov(self, request, payload: MotorDetailLOV_schema):
        MotorDetailLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Motor LOV created successfully"}, status=200)
        
    @http_delete('/motor-lov/{id}')
    def delete_motor_lov(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(MotorDetailLOV, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Motor LOV deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
        
    # Shaft/Seal Detail LOV API
    
    @http_get('/shaft-seal-lov')
    def get_shaft_seal_lov(self, request):
        shaft_seal_lov_id = request.GET.get('id')
        if shaft_seal_lov_id:
            try:
                shaft_seal_lov = ShaftSealLOV.objects.get(shaft_seal_lov_id=shaft_seal_lov_id)
                return JsonResponse({"data": model_to_dict(shaft_seal_lov)}, status=200)
            except ShaftSealLOV.DoesNotExist:
                return JsonResponse({"error": "Shaft Seal LOV not found"}, status=404)
        else:
            shaft_seal_lovs = list(ShaftSealLOV.objects.all().values())
            return JsonResponse({"data": shaft_seal_lovs}, status=200)
        
    @http_put('/shaft-seal-lov/{id}', response=ShaftSealLOV_schema)
    def update_shaft_seal_lov(self, request, id: str, payload: ShaftSealLOV_schema):
        uuid_id = UUID(id)
        data = get_object_or_404(ShaftSealLOV, pk=uuid_id)
        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(data, attr, value) 
        data.save()
        return data
        
    @http_post('/shaft-seal-lov')
    def create_shaft_seal_lov(self, request, payload: ShaftSealLOV_schema):
        ShaftSealLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Shaft Seal LOV created successfully"}, status=200)
    
    @http_delete('/shaft-seal-lov/{id}')
    def delete_shaft_seal_lov(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(ShaftSealLOV, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Shaft Seal LOV deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)
        
    # Material Detail LOV API

    @http_get('/material-lov')
    def get_material_lov(self, request):
        material_lov_id = request.GET.get('id')
        if material_lov_id:
            try:
                material_lov = PumpMaterialLOV.objects.get(mat_lov_id=material_lov_id)
                return JsonResponse({"data": model_to_dict(material_lov)}, status=200)
            except PumpMaterialLOV.DoesNotExist:
                return JsonResponse({"error": "Material LOV not found"}, status=404)
        else:
            material_lovs = list(PumpMaterialLOV.objects.all().values())
            return JsonResponse({"data": material_lovs}, status=200)

    @http_put('/material-lov/{id}', response=PumpMaterialLOV_schema)
    def update_material_lov(self, request, id: str, payload: PumpMaterialLOV_schema):
        uuid_id = UUID(id)
        data = get_object_or_404(PumpMaterialLOV, pk=uuid_id)
        for attr, value in payload.dict(exclude_unset=True).items():
            setattr(data, attr, value) 
        data.save()
        return data
        
    @http_post('/material-lov')
    def create_material_lov(self, request, payload: PumpMaterialLOV_schema):
        PumpMaterialLOV.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Material LOV created successfully"}, status=200)
        
    @http_delete('/material-lov/{id}')
    def delete_material_lov(self, request, id: str):
        try:
            uuid_id = UUID(id)
            data = get_object_or_404(PumpMaterialLOV, pk=uuid_id)
            data.delete()
            return JsonResponse({"success": True, "message": "Material LOV deleted successfully"}, status=200)
        except ValueError:
            return JsonResponse({"error": "Invalid ID format"}, status=400)