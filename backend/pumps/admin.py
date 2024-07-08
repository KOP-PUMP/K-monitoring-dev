# admin.py

from django.contrib import admin

from .models import (
    PumpDetail,
    ImpellerList,
    MechSealApiPlanList,
    BearingList,
    CasingMaterialList,
    FlangRatingList,
    UnitList,
    MechanicalDesignList,
    PumpDetailList,
    MotorDetailList,
    SuctionPipeInfoList,
    PumpStandardList,
    SuctionDischargeDetailList,
    FaceMaterialDetail,
    SpringMaterialDetail,
    VibrationDetail,
)

class PumpDetailAdmin(admin.ModelAdmin):
    list_display = ('pump_id', 'user', 'brand', 'model', 'serial_no', 'location', 'timestamp')
    fields = ('user', 'doc_customer', 'doc_date', 'brand', 'model', 'tag_no', 'pump_type_id', 
              'serial_no', 'media', 'stage', 'location', 'design_temp', 'max_temp', 'solid_type', 
              'solid_diameter', 'density', 'density_unit', 'viscosity', 'viscosity_unit', 'max_flow', 
              'max_flow_unit', 'min_flow', 'min_flow_unit', 'vapor_pressure', 'vapor_pressure_unit', 
              'pump_speed', 'pump_speed_unit', 'design_flow', 'design_flow_unit', 'design_head', 
              'design_head_unit', 'min_head', 'min_head_unit', 'max_head', 'max_head_unit', 'suction_velo', 
              'suction_velo_unit', 'discharge_velo', 'discharge_velo_unit', 'bep_head', 'bep_head_unit', 
              'bep_flow', 'bep_flow_unit', 'npshr', 'npshr_unit', 'pump_efficiency', 'pump_efficiency_unit', 
              'hyd_power', 'hyd_power_unit', 'voltage', 'voltage_unit', 'power_required_cal', 
              'power_required_cal_unit', 'power_min_flow', 'power_min_flow_unit', 'power_max_flow', 
              'power_max_flow_unit', 'power_bep_flow', 'power_bep_flow_unit', 'suggest_motor', 
              'suction_pipe_data_id', 'suction_pipe_size', 'suction_pipe_rating', 'suction_pipe_sch', 
              'discharge_pipe_data_id', 'discharge_pipe_size', 'discharge_pipe_rating', 'discharge_pipe_sch', 
              'tank_position', 'tank_design', 'tank_pressure', 'suction_head', 'suction_pipe_length', 
              'discharge_pipe_length_h', 'discharge_pipe_length_v', 'suction_pipe_id', 'discharge_pipe_id', 
              'suction_elbow', 'suction_tee', 'suction_reducer', 'suction_valve', 'suction_y_strainer', 
              'suction_other', 'suction_equi_length', 'discharge_equi_length', 'discharge_elbow', 
              'discharge_tee', 'discharge_reducer', 'discharge_valve', 'discharge_y_strainer', 
              'discharge_other', 'casing_mat_id', 'shaft_mat_id', 'shaft_mat', 'diffuser_mat_id', 
              'diffuser_mat', 'design_impeller_dia', 'impeller_max', 'impeller_mat_id', 'impeller_mat', 
              'materials_wear_ring_id', 'materials_wear_ring', 'bearing_nde', 'bearing_num', 
              'bearing_lubric_type', 'bearing_lubric_brand', 'bearing_lubric_no', 'bearing_de', 
              'bearing_de_no', 'bearing_last_chg_dt', 'sleeve_mat_id', 'sleeve_mat', 
              'bearing_housing_mat_id', 'bearing_housing_mat', 'gland_mat', 'casing_gas', 'oring_gas', 
              'impeller_gas', 'pump_lining_mat', 'base_plate', 'coup_model', 'coup_brand', 'coup_type', 
              'coup_size', 'coup_spacer', 'motor_brand', 'motor_model', 'motor_serial_no', 'motor_frame', 
              'motor_protection', 'motor_speed', 'motor_speed_unit', 'motor_rated', 'motor_rated_unit', 
              'motor_factor', 'motor_connection', 'motor_phase', 'motor_efficiency', 
              'motor_efficiency_unit', 'mech_main_temp', 'mech_main_pre', 'mech_seal_cham', 'mech_brand', 
              'mech_model', 'mech_size', 'mech_size_unit', 'mech_design_id', 'mech_design', 
              'mech_material', 'concentration', 'pump_status')
    search_fields = ('pump_id', 'user__username', 'brand', 'model', 'serial_no', 'location')
    list_filter = ('brand', 'model', 'location')
    # exclude = ('motor_drive', 'pump_standard', 'mech_api_plan', 'pump_discharge_size', 'pump_discharge_rating', 
    #            'rotation_de', 'motor_standard', 'pump_suction_size', 'pump_type_name', 'impeller_type', 
    #            'pump_suction_rating', 'motor_ie')

@admin.register(ImpellerList)
class ImpellerListAdmin(admin.ModelAdmin):
    list_display = ('impeller_type_id', 'impeller_type_name')
    search_fields = ('impeller_type_name',)

@admin.register(MechSealApiPlanList)
class MechSealApiPlanListAdmin(admin.ModelAdmin):
    list_display = ('mech_api_id', 'mech_api_plan')
    search_fields = ('mech_api_plan',)

@admin.register(BearingList)
class BearingListAdmin(admin.ModelAdmin):
    list_display = ('rotation_de_id', 'rotation')
    search_fields = ('rotation',)

@admin.register(CasingMaterialList)
class CasingMaterialListAdmin(admin.ModelAdmin):
    list_display = ('mat_cover_id', 'mat_cover_name', 'mat_cover_type')
    search_fields = ('mat_cover_name', 'mat_cover_type')

@admin.register(FlangRatingList)
class FlangRatingListAdmin(admin.ModelAdmin):
    list_display = ('flang_rating_id', 'flang_rating_name')
    search_fields = ('flang_rating_name',)

@admin.register(UnitList)
class UnitListAdmin(admin.ModelAdmin):
    list_display = ('k_lov_id', 'field_id', 'field_value')
    search_fields = ('field_id', 'field_value')

@admin.register(MechanicalDesignList)
class MechanicalDesignListAdmin(admin.ModelAdmin):
    list_display = ('mech_design_id', 'mech_design_name')
    search_fields = ('mech_design_name',)

@admin.register(PumpDetailList)
class PumpDetailListAdmin(admin.ModelAdmin):
    list_display = ('pump_id', 'pump_design', 'pump_type')
    search_fields = ('pump_design', 'pump_type')

@admin.register(MotorDetailList)
class MotorDetailListAdmin(admin.ModelAdmin):
    list_display = ('motor_drive_id', 'drive_system', 'ie_class', 'standard')
    search_fields = ('drive_system', 'ie_class', 'standard')

@admin.register(SuctionPipeInfoList)
class SuctionPipeInfoListAdmin(admin.ModelAdmin):
    list_display = ('pipe_lov_id', 'pipe_sch', 'pipe_size', 'pipe_id', 'fac_number', 'equipment', 'brand', 'short_model', 'model', 'data_type', 'sequence', 'rpm', 'imp_dia', 'flow', 'head', 'eff', 'npshr', 'kw', 'curve_format', 'eff_rl', 'eff_status', 'eff_distance', 'tolerance', 'scale_xy', 'update_time', 'dry_sat', 'liquid')
    search_fields = ('pipe_id', 'equipment', 'brand', 'model')

@admin.register(PumpStandardList)
class PumpStandardListAdmin(admin.ModelAdmin):
    list_display = ('pump_standard_id', 'name')
    search_fields = ('name',)

@admin.register(SuctionDischargeDetailList)
class SuctionDischargeDetailListAdmin(admin.ModelAdmin):
    list_display = ('id', 'suction_discharge_value')
    search_fields = ('suction_discharge_value',)

@admin.register(FaceMaterialDetail)
class FaceMaterialDetailAdmin(admin.ModelAdmin):
    list_display = ('mat_face_id', 'mat_face_name', 'mat_face_type')
    search_fields = ('mat_face_name', 'mat_face_type')

@admin.register(SpringMaterialDetail)
class SpringMaterialDetailAdmin(admin.ModelAdmin):
    list_display = ('mat_spring_id', 'mat_spring_name', 'mat_spring_type')
    search_fields = ('mat_spring_name', 'mat_spring_type')

@admin.register(VibrationDetail)
class VibrationDetailAdmin(admin.ModelAdmin):
    list_display = ('voltage', 'acceptable', 'unsatisfied', 'unacceptable')
    search_fields = ('voltage', 'acceptable', 'unsatisfied', 'unacceptable')


admin.site.register(PumpDetail, PumpDetailAdmin)
