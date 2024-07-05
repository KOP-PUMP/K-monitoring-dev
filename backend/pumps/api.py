from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from django.shortcuts import get_object_or_404
from pumps.models import PumpDetail, EngineeringDetail
from pumps.schemas import (PumpDetailIn, PumpDetailOut, EngineeringDetailIn, EngineeringDetailOut)

from pumps.permissions import *

@api_controller('/pumps', tags=['PumpDetail'], auth=JWTAuth())
class PumpDetailController:
    @http_post('/', response=PumpDetailOut, permissions=[CanAddPump])
    def create_pump(self, request, payload: PumpDetailIn):
        pump = PumpDetail.objects.create(user=request.user, **payload.dict())
        return pump

    @http_get('/', response=list[PumpDetailOut], permissions=[CanViewPump])
    def list_pumps(self, request):
        user = request.user
        return PumpDetail.objects.filter(user=user)

    @http_get('/{pump_id}/', response=PumpDetailOut, permissions=[CanViewPump])
    def get_pump(self, request, pump_id: int):
        user = request.user
        pump = get_object_or_404(PumpDetail, pk=pump_id, user=user)
        return pump

    @http_put('/{pump_id}/', response=PumpDetailOut, permissions=[CanChangePump])
    def update_pump(self, request, pump_id: int, payload: PumpDetailIn):
        user = request.user
        pump = get_object_or_404(PumpDetail, pk=pump_id, user=user)
        for attr, value in payload.dict().items():
            setattr(pump, attr, value)
        pump.save()
        return pump

    @http_delete('/{pump_id}/', permissions=[CanDeletePump])
    def delete_pump(self, request, pump_id: int):
        user = request.user
        pump = get_object_or_404(PumpDetail, pk=pump_id, user=user)
        pump.delete()
        return {"success": True}


@api_controller('/engineering', tags=['EngineeringDetail'], auth=JWTAuth(), permissions=[CanViewEngineering, CanAddEngineering, CanChangeEngineering, CanDeleteEngineering])
class EngineeringDetailController:
    @http_post('/', response=EngineeringDetailOut, permissions=[CanAddEngineering])
    def create_engineering(self, request, payload):
        engineering = EngineeringDetail.objects.create(**payload.dict())
        return engineering

    @http_get('/', response=list[EngineeringDetailOut], permissions=[CanViewEngineering])
    def list_engineering(self, request):
        return EngineeringDetail.objects.all()

    @http_get('/{pump_id}/', response=EngineeringDetailOut, permissions=[CanViewEngineering])
    def get_engineering(self, request, pump_id: int):
        engineering = get_object_or_404(EngineeringDetail, pk=pump_id)
        return engineering

    @http_put('/{pump_id}/', response=EngineeringDetailOut, permissions=[CanChangeEngineering])
    def update_engineering(self, request, pump_id: int, payload):
        engineering = get_object_or_404(EngineeringDetail, pk=pump_id)
        for attr, value in payload.dict().items():
            setattr(engineering, attr, value)
        engineering.save()
        return engineering

    @http_delete('/{pump_id}/', permissions=[CanDeleteEngineering])
    def delete_engineering(self, request, pump_id: int):
        engineering = get_object_or_404(EngineeringDetail, pk=pump_id)
        engineering.delete()
        return {"success": True}