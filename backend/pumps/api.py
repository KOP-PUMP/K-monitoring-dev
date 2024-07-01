from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from django.shortcuts import get_object_or_404
from pumps.models import PumpDetail, EngineeringDetail
from pumps.schemas import PumpDetailIn, PumpDetailOut, EngineeringDetailIn, EngineeringDetailOut
from pumps.permissions import CanAddPumpDetail, CanViewPumpDetail, CanChangePumpDetail, CanDeletePumpDetail

@api_controller('/pumps', tags=['PumpDetail'], auth=JWTAuth())
class PumpDetailController:
    @http_post('/', response=PumpDetailOut, permissions=[CanAddPumpDetail])
    def create_pump(self, request, payload: PumpDetailIn):
        pump = PumpDetail.objects.create(**payload.dict())
        return pump

    @http_get('/', response=list[PumpDetailOut], permissions=[CanViewPumpDetail])
    def list_pumps(self, request):
        return PumpDetail.objects.all()

    @http_get('/{pump_id}/', response=PumpDetailOut, permissions=[CanViewPumpDetail])
    def get_pump(self, request, pump_id: int):
        pump = get_object_or_404(PumpDetail, pk=pump_id)
        return pump

    @http_put('/{pump_id}/', response=PumpDetailOut, permissions=[CanChangePumpDetail])
    def update_pump(self, request, pump_id: int, payload: PumpDetailIn):
        pump = get_object_or_404(PumpDetail, pk=pump_id)
        for attr, value in payload.dict().items():
            setattr(pump, attr, value)
        pump.save()
        return pump

    @http_delete('/{pump_id}/', permissions=[CanDeletePumpDetail])
    def delete_pump(self, request, pump_id: int):
        pump = get_object_or_404(PumpDetail, pk=pump_id)
        pump.delete()
        return {"success": True}


@api_controller('/engineering', auth=JWTAuth())
class EngineeringDetailController:
    @http_post('/', response=EngineeringDetailOut)
    def modify_engineering(self, request, payload):
        engineering = EngineeringDetail.objects.create(**payload.dict())