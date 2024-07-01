# admin.py

from django.contrib import admin
from .models import PumpDetail

class PumpDetailAdmin(admin.ModelAdmin):
    list_display = ('pump_id', 'user', 'brand', 'model', 'serial_no', 'location', 'timestamp')
    fields = ('user', 'doc_customer', 'doc_no', 'doc_date', 'brand', 'model', 'tag_no', 'pump_type_id', 
              'pump_type_name', 'serial_no', 'media', 'pump_standard_id', 'pump_standard', 'pump_design', 
              'stage', 'location', 'design_temp', 'max_temp', 'solid_type', 'solid_diameter', 'density', 
              'density_unit', 'viscosity', 'viscosity_unit', 'max_flow', 'max_flow_unit', 'min_flow', 
              'min_flow_unit', 'vapor_pressure', 'vapor_pressure_unit', 'pump_speed', 'pump_speed_unit', 
              'design_flow', 'design_flow_unit', 'design_head', 'design_head_unit', 'min_head', 'min_head_unit', 
              'max_head', 'max_head_unit', 'suction_velo', 'suction_velo_unit', 'discharge_velo', 
              'discharge_velo_unit', 'bep_head', 'bep_head_unit', 'bep_flow', 'bep_flow_unit', 'npshr', 
              'npshr_unit', 'pump_efficiency', 'pump_efficiency_unit', 'hyd_power', 'hyd_power_unit', 'voltage', 
              'voltage_unit', 'power_required_cal', 'power_required_cal_unit', 'power_min_flow', 
              'power_min_flow_unit', 'power_max_flow', 'power_max_flow_unit', 'power_bep_flow', 
              'power_bep_flow_unit', 'suggest_motor', 'pump_suction_size_id', 'pump_suction_size', 
              'pump_suction_rating_id', 'pump_suction_rating', 'pump_discharge_size_id', 'pump_discharge_size', 
              'pump_discharge_rating_id', 'pump_discharge_rating', 'suction_pipe_data_id', 'suction_pipe_size', 
              'suction_pipe_rating', 'suction_pipe_sch', 'discharge_pipe_data_id', 'discharge_pipe_size', 
              'discharge_pipe_rating', 'discharge_pipe_sch', 'tank_position', 'tank_design', 'tank_pressure', 
              'suction_head', 'suction_pipe_length', 'discharge_pipe_length_h', 'discharge_pipe_length_v', 
              'suction_pipe_id', 'discharge_pipe_id', 'suction_elbow', 'suction_tee', 'suction_reducer', 
              'suction_valve', 'suction_y_strainer', 'suction_other', 'suction_equi_length', 
              'discharge_equi_length', 'discharge_elbow', 'discharge_tee', 'discharge_reducer', 'discharge_valve', 
              'discharge_y_strainer', 'discharge_other', 'casing_mat_id', 'casing_mat', 'shaft_mat_id', 
              'shaft_mat', 'diffuser_mat_id', 'diffuser_mat', 'impeller_type_id', 'impeller_type', 
              'design_impeller_dia', 'impeller_max', 'impeller_mat_id', 'impeller_mat', 'materials_wear_ring_id', 
              'materials_wear_ring', 'bearing_nde', 'bearing_num', 'bearing_lubric_type', 'bearing_lubric_brand', 
              'bearing_lubric_no', 'rotation_de_id', 'rotation_de', 'bearing_de', 'bearing_de_no', 
              'bearing_last_chg_dt', 'sleeve_mat_id', 'sleeve_mat', 'bearing_housing_mat_id', 'bearing_housing_mat', 
              'gland_mat', 'casing_gas', 'oring_gas', 'impeller_gas', 'pump_lining_mat', 'base_plate', 'coup_model', 
              'coup_brand', 'coup_type', 'coup_size', 'coup_spacer', 'motor_brand', 'motor_model', 'motor_serial_no', 
              'motor_drive_id', 'motor_drive', 'motor_frame', 'motor_protection', 'motor_standard', 'motor_ie', 
              'motor_speed', 'motor_speed_unit', 'motor_rated', 'motor_rated_unit', 'motor_factor', 'motor_connection', 
              'motor_phase', 'motor_efficiency', 'motor_efficiency_unit', 'mech_api_id', 'mech_api_plan', 
              'mech_main_temp', 'mech_main_pre', 'mech_seal_cham', 'mech_brand', 'mech_model', 'mech_size', 
              'mech_size_unit', 'mech_design_id', 'mech_design', 'mech_material', 'concentration', 'pump_status')
              
    search_fields = ('pump_id', 'user__username', 'brand', 'model', 'serial_no', 'location')
    list_filter = ('brand', 'model', 'location')

admin.site.register(PumpDetail, PumpDetailAdmin)
