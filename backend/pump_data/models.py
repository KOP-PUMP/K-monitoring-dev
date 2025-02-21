from django.db import models
import uuid

# Create your models here.

#Model for list of values


#This is section of LOV data model include unit and pump lov
class KMonitoringLOV(models.Model):
    id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4) 
    type_name = models.CharField(max_length=100 , blank=False, null=False)
    product_name = models.CharField(max_length=100 , blank=False, null=False)
    data_value = models.CharField(max_length=100,blank=True, null=True)
    data_value2 = models.CharField(max_length=100,blank=True, null=True)
    data_value3 = models.CharField(max_length=100,blank=True, null=True)
    data_value4 = models.CharField(max_length=100,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    def __str__(self):
        return self.type_name
    
    class Meta:
       db_table = 'tbl_k_monitoring_lov'

class PumpDetailLOV(models.Model):
    pump_lov_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    pump_brand = models.TextField(max_length=100,blank=True, null=True)
    pump_model = models.TextField(max_length=100,blank=True, null=True)
    model_size = models.TextField(max_length=100,blank=True, null=True)
    pump_design = models.TextField(max_length=100,blank=True, null=True)
    pump_standard = models.TextField(max_length=100,blank=True, null=True)
    pump_standard_no = models.TextField(max_length=100,blank=True, null=True)
    pump_impeller_type = models.TextField(max_length=100,blank=True, null=True)
    pump_flange_con_std = models.TextField(max_length=100,blank=True, null=True)
    pump_type = models.TextField(max_length=100,blank=True, null=True)
    pump_stage = models.TextField(max_length=100,blank=True, null=True)
    pump_seal_chamber = models.TextField(max_length=100,blank=True, null=True)
    pump_oil_seal = models.TextField(max_length=100,blank=True, null=True)
    pump_max_temp = models.TextField(max_length=100,blank=True, null=True)
    pump_suction_size_id = models.TextField(max_length=100,blank=True, null=True)
    pump_suction_size = models.TextField(max_length=100,blank=True, null=True)
    pump_suction_rating_id = models.TextField(max_length=100,blank=True, null=True)
    pump_suction_rating = models.TextField(max_length=100,blank=True, null=True)
    pump_discharge_size_id = models.TextField(max_length=100,blank=True, null=True)
    pump_discharge_size = models.TextField(max_length=100,blank=True, null=True)
    pump_discharge_rating_id = models.TextField(max_length=100,blank=True, null=True)
    pump_discharge_rating = models.TextField(max_length=100,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    class Meta:
        db_table = 'tbl_pump_detail_lov'

    def __str__(self):
        return f"{self.pump_model} {self.pump_brand}"
    
class MotorDetailLOV(models.Model):
    motor_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    motor_model = models.TextField(max_length=100,blank=True, null=True)
    motor_serial_no = models.TextField(max_length=100,blank=True, null=True)
    motor_brand = models.TextField(max_length=100,blank=True, null=True)
    motor_drive = models.TextField(max_length=100,blank=True, null=True)
    motor_standard = models.TextField(max_length=100,blank=True, null=True)
    motor_ie = models.TextField(max_length=100,blank=True, null=True)
    motor_speed = models.TextField(max_length=100,blank=True, null=True)
    motor_speed_unit = models.TextField(max_length=100,blank=True, null=True)
    motor_rated = models.TextField(max_length=100,blank=True, null=True)
    motor_rated_unit = models.TextField(max_length=100,blank=True, null=True)
    motor_factor = models.TextField(max_length=100,blank=True, null=True)
    motor_connection = models.TextField(max_length=100,blank=True, null=True)
    motor_phase = models.TextField(max_length=100,blank=True, null=True)
    motor_efficiency = models.TextField(max_length=100,blank=True, null=True)
    motor_efficiency_unit = models.TextField(max_length=100,blank=True, null=True)
    motor_rated_current = models.TextField(max_length=100,blank=True, null=True)
    motor_rated_current_unit = models.TextField(max_length=100,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    class Meta:
        db_table = 'tbl_motor_detail_lov'

    def __str__(self):
        return f"{self.model} {self.brand}"

class ShaftSealLOV(models.Model):
    shaft_seal_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    shaft_seal_design = models.TextField(max_length=100,blank=True, null=True)
    shaft_seal_brand = models.TextField(max_length=100,blank=True, null=True)
    shaft_seal_model = models.TextField(max_length=100,blank=True, null=True)
    shaft_seal_material = models.TextField(max_length=100,blank=True, null=True)
    mechanical_seal_api_plan = models.TextField(max_length=100,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    class Meta:
        db_table = 'tbl_shaft_seal_lov'

    def __str__(self):
        return f"{self.shaft_seal_model} {self.shaft_seal_brand}"

class PumpMaterialLOV(models.Model):
    material_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    pump_type_mat = models.TextField(max_length=100,blank=True, null=True)
    pump_mat_code = models.TextField(max_length=100,blank=True, null=True)
    casing_mat = models.TextField(max_length=100,blank=True, null=True)
    casing_cover_mat = models.TextField(max_length=100,blank=True, null=True)
    impeller_mat = models.TextField(max_length=100,blank=True, null=True)
    liner_mat = models.TextField(max_length=100,blank=True, null=True)
    base_mat = models.TextField(max_length=100,blank=True, null=True)
    pump_head_mat = models.TextField(max_length=100,blank=True, null=True)
    pump_head_cover_mat = models.TextField(max_length=100,blank=True, null=True)
    stage_casing_diffuser_mat = models.TextField(max_length=100,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    created_by = models.CharField(max_length=100,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_by = models.CharField(max_length=100,blank=True, null=True)

    class Meta:
        db_table = 'tbl_pump_material_lov'

    def __str__(self):
        return f"{self.pump_type_mat}"


class PumpDetail(models.Model):
    #Related tables
    pump_id = models.UUIDField(primary_key=True, editable=False , default=uuid.uuid4)
    pump_model_id = models.ForeignKey(PumpDetailLOV, on_delete=models.SET_NULL, blank=True, null=True)
    pump_mat_id = models.ForeignKey(PumpMaterialLOV, on_delete=models.SET_NULL, blank=True, null=True)
    motor_detail_id = models.ForeignKey(MotorDetailLOV, on_delete=models.SET_NULL, blank=True, null=True)
    shaft_seal_id = models.ForeignKey(ShaftSealLOV, on_delete=models.SET_NULL, blank=True, null=True)
    #Pump General details
    company_code = models.TextField(max_length=100,blank=True, null=True)
    doc_customer = models.TextField(max_length=100,blank=True, null=True)
    doc_no = models.TextField(max_length=100,blank=True, null=True)
    doc_date = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    tag_no = models.TextField(max_length=100,blank=True, null=True)
    pump_standard = models.TextField(max_length=100,blank=True, null=True)
    pump_standard_no = models.TextField(max_length=100,blank=True, null=True)
    pump_design = models.TextField(max_length=100,blank=True, null=True)
    location = models.TextField(max_length=100,blank=True, null=True)
    base_plate_id = models.TextField(max_length=100,blank=True, null=True)
    base_plate = models.TextField(max_length=100,blank=True, null=True)
    pump_status = models.TextField(max_length=100,blank=True, null=True)
    #Pump Technical details
    max_temp = models.TextField(max_length=100,blank=True, null=True)
    max_flow = models.TextField(max_length=100,blank=True, null=True)
    max_flow_unit = models.TextField(max_length=100,blank=True, null=True)
    min_flow = models.TextField(max_length=100,blank=True, null=True)
    min_flow_unit = models.TextField(max_length=100,blank=True, null=True)
    pump_speed = models.TextField(max_length=100,blank=True, null=True)
    pump_speed_unit = models.TextField(max_length=100,blank=True, null=True)
    design_flow = models.TextField(max_length=100,blank=True, null=True)
    design_flow_unit = models.TextField(max_length=100,blank=True, null=True)
    design_head = models.TextField(max_length=100,blank=True, null=True)
    design_head_unit = models.TextField(max_length=100,blank=True, null=True)
    shut_off_head = models.TextField(max_length=100,blank=True, null=True)
    shut_off_head_unit = models.TextField(max_length=100,blank=True, null=True)
    min_head = models.TextField(max_length=100,blank=True, null=True)
    min_head_unit = models.TextField(max_length=100,blank=True, null=True)
    max_head = models.TextField(max_length=100,blank=True, null=True)
    max_head_unit = models.TextField(max_length=100,blank=True, null=True)
    suction_velo = models.TextField(max_length=100,blank=True, null=True)
    suction_velo_unit = models.TextField(max_length=100,blank=True, null=True)
    discharge_velo = models.TextField(max_length=100,blank=True, null=True)
    discharge_velo_unit = models.TextField(max_length=100,blank=True, null=True)
    bep_head = models.TextField(max_length=100,blank=True, null=True)
    bep_head_unit = models.TextField(max_length=100,blank=True, null=True)
    bep_flow = models.TextField(max_length=100,blank=True, null=True)
    bep_flow_unit = models.TextField(max_length=100,blank=True, null=True)
    npshr = models.TextField(max_length=100,blank=True, null=True)
    npshr_unit = models.TextField(max_length=100,blank=True, null=True)
    pump_efficiency = models.TextField(max_length=100,blank=True, null=True)
    pump_efficiency_unit = models.TextField(max_length=100,blank=True, null=True)
    hyd_power = models.TextField(max_length=100,blank=True, null=True)
    hyd_power_unit = models.TextField(max_length=100,blank=True, null=True)
    power_required_cal = models.TextField(max_length=100,blank=True, null=True)
    power_required_cal_unit = models.TextField(max_length=100,blank=True, null=True)
    power_min_flow = models.TextField(max_length=100,blank=True, null=True)
    power_min_flow_unit = models.TextField(max_length=100,blank=True, null=True)
    power_max_flow = models.TextField(max_length=100,blank=True, null=True)
    power_max_flow_unit = models.TextField(max_length=100,blank=True, null=True)
    power_bep_flow = models.TextField(max_length=100,blank=True, null=True)
    power_bep_flow_unit = models.TextField(max_length=100,blank=True, null=True)
    #Pump Application Data
    media = models.TextField(max_length=100, blank=True, null=True)
    oper_temp = models.TextField(max_length=100, blank=True, null=True)
    solid_type_id = models.TextField(max_length=100, blank=True, null=True)
    solid_type = models.TextField(max_length=100, blank=True, null=True)
    solid_diameter = models.TextField(max_length=100, blank=True, null=True)
    density = models.TextField(max_length=100, blank=True, null=True)
    density_unit = models.TextField(max_length=100, blank=True, null=True)
    viscosity = models.TextField(max_length=100, blank=True, null=True)
    viscosity_unit = models.TextField(max_length=100, blank=True, null=True)
    vapor_pressure = models.TextField(max_length=100, blank=True, null=True)
    vapor_pressure_unit = models.TextField(max_length=100, blank=True, null=True)
    tank_position = models.TextField(max_length=100, blank=True, null=True)
    tank_design = models.TextField(max_length=100, blank=True, null=True)
    tank_pressure = models.TextField(max_length=100, blank=True, null=True)
    suction_head = models.TextField(max_length=100, blank=True, null=True)
    concentration = models.TextField(max_length=100, blank=True, null=True)
    solid_percentage = models.TextField(max_length=100, blank=True, null=True)
    #Motor General Details
    voltage = models.TextField(max_length=100,blank=True, null=True)
    voltage_unit = models.TextField(max_length=100,blank=True, null=True)
    suggest_motor = models.TextField(max_length=100,blank=True, null=True)
    #Mechanical Seal Details
    mech_api_plan = models.TextField(max_length=100,blank=True, null=True)
    mech_main_temp = models.TextField(max_length=100,blank=True, null=True)
    mech_main_pre = models.TextField(max_length=100,blank=True, null=True)
    mech_size = models.TextField(max_length=100,blank=True, null=True)
    mech_size_unit = models.TextField(max_length=100,blank=True, null=True)
    #Material and Impeller Details
    design_impeller_dia = models.TextField(max_length=100,blank=True, null=True)
    impeller_max = models.TextField(max_length=100,blank=True, null=True)
    #Flange Details
    flang_con_std = models.TextField(max_length=100,blank=True, null=True)
    pump_suction_size_id = models.TextField(max_length=100,blank=True, null=True)
    pump_suction_size = models.TextField(max_length=100,blank=True, null=True)
    pump_suction_rating_id = models.TextField(max_length=100,blank=True, null=True)
    pump_suction_rating = models.TextField(max_length=100,blank=True, null=True)
    pump_discharge_size_id = models.TextField(max_length=100,blank=True, null=True)
    pump_discharge_size = models.TextField(max_length=100,blank=True, null=True)
    pump_discharge_rating_id = models.TextField(max_length=100,blank=True, null=True)
    pump_discharge_rating = models.TextField(max_length=100,blank=True, null=True)
    suction_pipe_data_id = models.TextField(max_length=100,blank=True, null=True)
    suction_pipe_size = models.TextField(max_length=100,blank=True, null=True)
    suction_pipe_sch = models.TextField(max_length=100,blank=True, null=True)
    discharge_pipe_data_id = models.TextField(max_length=100,blank=True, null=True)
    discharge_pipe_size = models.TextField(max_length=100,blank=True, null=True)
    discharge_pipe_sch = models.TextField(max_length=100,blank=True, null=True)
    suction_pipe_length = models.TextField(max_length=100,blank=True, null=True)
    discharge_pipe_length_h = models.TextField(max_length=100,blank=True, null=True)
    discharge_pipe_length_v = models.TextField(max_length=100,blank=True, null=True)
    suction_pipe_id = models.TextField(max_length=100,blank=True, null=True)
    suction_pipe_id_unit = models.TextField(max_length=100,blank=True, null=True)
    discharge_pipe_id = models.TextField(max_length=100,blank=True, null=True)
    discharge_pipe_id_unit = models.TextField(max_length=100,blank=True, null=True)
    suction_elbow = models.TextField(max_length=100,blank=True, null=True)
    suction_tee = models.TextField(max_length=100,blank=True, null=True)
    suction_reducer = models.TextField(max_length=100,blank=True, null=True)
    suction_valve = models.TextField(max_length=100,blank=True, null=True)
    suction_y_strainer = models.TextField(max_length=100,blank=True, null=True)
    suction_other = models.TextField(max_length=100,blank=True, null=True)
    suction_equi_length = models.TextField(max_length=100,blank=True, null=True)
    discharge_equi_length = models.TextField(max_length=100,blank=True, null=True)
    discharge_elbow = models.TextField(max_length=100,blank=True, null=True)
    discharge_tee = models.TextField(max_length=100,blank=True, null=True)
    discharge_reducer = models.TextField(max_length=100,blank=True, null=True)
    discharge_valve = models.TextField(max_length=100,blank=True, null=True)
    discharge_y_strainer = models.TextField(max_length=100,blank=True, null=True)
    discharge_other = models.TextField(max_length=100,blank=True, null=True)
    #Coupling Details
    coup_type = models.TextField(max_length=100,blank=True, null=True)
    #Bearing Detail
    bearing_nde_one_id = models.TextField(max_length=100,blank=True, null=True)
    bearing_nde_one = models.TextField(max_length=100,blank=True, null=True)
    bearing_nde_two_id = models.TextField(max_length=100,blank=True, null=True)
    bearing_nde_two = models.TextField(max_length=100,blank=True, null=True)
    bearing_lubric_type = models.TextField(max_length=100,blank=True,null=True)
    bearing_lubric_brand = models.TextField(max_length=100,blank=True,null=True)
    bearing_lubric_no = models.TextField(max_length=100,blank=True,null=True)
    rotation_de = models.TextField(max_length=100,blank=True,null=True)
    bearing_de_one_id = models.TextField(max_length=100,blank=True,null=True)
    bearing_de_one = models.TextField(max_length=100,blank=True,null=True)
    bearing_de_two_id = models.TextField(max_length=100,blank=True,null=True)
    bearing_de_two = models.TextField(max_length=100,blank=True,null=True)
    bearing_last_chg_dt = models.DateTimeField(blank=True,null=True)

    class Meta:
        db_table = 'tbl_pump_detail'

    def __str__(self):
        if self.pump_model_id:  # Check if related object exists
            return f"{self.pump_model_id.pump_model} {self.pump_model_id.pump_brand} {self.company_code} "
        return f"Pump Detail of {self.company_code}"

