from django.http import JsonResponse
from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth
from django.shortcuts import get_object_or_404
from collections import defaultdict

from .models import (PumpDetail, EngineeringDetail, UnitList,
                     ImpellerList, MechSealApiPlanList, BearingList,
                     CasingMaterialList, FlangRatingList, MechanicalDesignList,
                     PumpDetailList, MotorDetailList, SuctionPipeInfoList,
                     PumpStandardList, SuctionDischargeDetailList, FaceMaterialDetail,
                     SpringMaterialDetail, VibrationDetail)
from .schemas.pumps import (PumpDetailIn, PumpDetailOut, EngineeringDetailIn, EngineeringDetailOut)
from .schemas.units import *
from .schemas.dropdowns import DropDownData
from .permissions import *

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


@api_controller('/dropdown', tags=['Dropdown'], auth=JWTAuth())
class DropDownDataController:
    @http_get('/', response=DropDownData)
    def get_dropdown_data(self, request):
        impeller_list = ImpellerList.objects.values('impeller_type_id', 'impeller_type_name')
        mech_seal_api_plan_list = MechSealApiPlanList.objects.values('mech_api_id', 'mech_api_plan')
        bearing_list = BearingList.objects.values('rotation_de_id', 'rotation')
        casing_material_list = CasingMaterialList.objects.values('mat_cover_id', 'mat_cover_name', 'mat_cover_type')
        flang_rating_list = FlangRatingList.objects.values('flang_rating_id', 'flang_rating_name')
        mechanical_design_list = MechanicalDesignList.objects.values('mech_design_id', 'mech_design_name')
        pump_detail_list = PumpDetailList.objects.values('pump_id', 'pump_design', 'pump_type')
        motor_detail_list = MotorDetailList.objects.values('motor_drive_id', 'drive_system', 'ie_class', 'standard')
        suction_pipe_info_list = SuctionPipeInfoList.objects.values('pipe_lov_id', 'pipe_sch', 'pipe_size', 'pipe_id', 'fac_number', 'equipment', 'brand', 'short_model', 'model', 'data_type', 'sequence', 'rpm', 'imp_dia', 'flow', 'head', 'eff', 'npshr', 'kw', 'curve_format', 'eff_rl', 'eff_status', 'eff_distance', 'tolerance', 'scale_xy', 'update_time', 'dry_sat', 'liquid')
        pump_standard_list = PumpStandardList.objects.values('pump_standard_id', 'name')
        suction_discharge_detail_list = SuctionDischargeDetailList.objects.values('id', 'suction_discharge_value')
        face_material_detail = FaceMaterialDetail.objects.values('mat_face_id', 'mat_face_name', 'mat_face_type')
        spring_material_detail = SpringMaterialDetail.objects.values('mat_spring_id', 'mat_spring_name', 'mat_spring_type')
        vibration_detail = VibrationDetail.objects.values('voltage', 'acceptable', 'unsatisfied', 'unacceptable')

        data = {
            "impeller_list": list(impeller_list),
            "mech_seal_api_plan_list": list(mech_seal_api_plan_list),
            "bearing_list": list(bearing_list),
            "casing_material_list": list(casing_material_list),
            "flang_rating_list": list(flang_rating_list),
            "mechanical_design_list": list(mechanical_design_list),
            "pump_detail_list": list(pump_detail_list),
            "motor_detail_list": list(motor_detail_list),
            "suction_pipe_info_list": list(suction_pipe_info_list),
            "pump_standard_list": list(pump_standard_list),
            "suction_discharge_detail_list": list(suction_discharge_detail_list),
            "face_material_detail": list(face_material_detail),
            "spring_material_detail": list(spring_material_detail),
            "vibration_detail": list(vibration_detail),
        }

        print(data)
        print("-------------------")
        return data


@api_controller('/units', tags=['Units'], auth=JWTAuth())
class UnitDataController:
    @http_get('/', response=UnitsData)
    def get_unit_data(self, request):
        TO_EXCLUDE = ['tbl_pump_detail_suggest_motor_range', 'tbl_pump_detail_coup_type', 'tbl_pump_detail_motor_phase', 'tbl_pump_detail_pump_status']
        units_data = (
            UnitList.objects.exclude(field_id__in=TO_EXCLUDE)
            .values('field_id', 'k_lov_id', 'field_value')
            .order_by('field_id')
        )
        grouped_data = defaultdict(list)

        for unit in units_data:
            field_id = unit['field_id']
            k_lov_id = unit['k_lov_id']
            field_value = unit['field_value']
            grouped_data[field_id].append({"id": k_lov_id, "field_value": field_value})

        formatted_data = dict(grouped_data)
        return JsonResponse(formatted_data, safe=False)
