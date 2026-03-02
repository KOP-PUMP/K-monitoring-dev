from ninja import Schema
from uuid import UUID , uuid4
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class KMonitoringLOV_schema(Schema):
    id: Optional[UUID] = Field(default_factory=uuid4) 
    type_name: str
    product_name: str
    data_value: Optional[str] = None
    data_value2: Optional[str] = None
    data_value3: Optional[str] = None
    data_value4: Optional[str] = None
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

class PumpDetailLOV_schema(Schema):
    pump_lov_id : Optional[UUID]=Field(default_factory=uuid4)
    pump_code_name : Optional[str]=None
    pump_brand : Optional[str]=None
    pump_model : Optional[str]=None
    pump_model_size : Optional[str]=None
    pump_design : Optional[str]=None
    pump_standard : Optional[str]=None
    pump_standard_no : Optional[str]=None
    pump_impeller_type : Optional[str]=None
    pump_flange_con_std : Optional[str]=None
    pump_type_name : Optional[str]=None
    pump_stage : Optional[str]=None
    pump_seal_chamber : Optional[str]=None
    pump_oil_seal : Optional[str]=None
    pump_max_temp : Optional[str]=None
    pump_suction_size_id : Optional[str]=None
    pump_suction_size : Optional[str]=None
    pump_suction_rating : Optional[str]=None
    pump_discharge_size_id : Optional[str]=None
    pump_discharge_size : Optional[str]=None
    pump_discharge_rating : Optional[str]=None
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None
    
class MotorDetailLOV_schema(Schema):
    motor_lov_id : Optional[UUID]=Field(default_factory=uuid4)
    motor_code_name : Optional[str]=None
    motor_model : Optional[str]=None
    motor_serial_no : Optional[str]=None
    motor_brand : Optional[str]=None
    motor_drive : Optional[str]=None
    motor_standard : Optional[str]=None
    motor_ie : Optional[str]=None
    motor_speed : Optional[str]=None
    motor_speed_unit : Optional[str]=None
    motor_rated : Optional[str]=None
    motor_rated_unit : Optional[str]=None
    motor_factor : Optional[str]=None
    motor_connection : Optional[str]=None
    motor_phase : Optional[str]=None
    motor_efficiency : Optional[str]=None
    motor_efficiency_unit : Optional[str]=None
    motor_rated_current : Optional[str]=None
    motor_rated_current_unit : Optional[str]=None
    coup_type : Optional[str]=None
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

class ShaftSealLOV_schema(Schema):
    shaft_seal_lov_id : Optional[UUID]=Field(default_factory=uuid4)
    shaft_seal_code_name : Optional[str]=None
    shaft_seal_design : Optional[str]=None
    shaft_seal_brand : Optional[str]=None
    shaft_seal_model : Optional[str]=None
    shaft_seal_material : Optional[str]=None
    mechanical_seal_api_plan : Optional[str]=None
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

class PumpMaterialLOV_schema(Schema):
    mat_lov_id : Optional[UUID]=Field(default_factory=uuid4)
    mat_code_name : Optional[str]=None
    pump_type_mat : Optional[str]=None
    pump_mat_code : Optional[str]=None
    casing_mat : Optional[str]=None
    casing_cover_mat : Optional[str]=None
    impeller_mat : Optional[str]=None
    liner_mat : Optional[str]=None
    pump_head_mat : Optional[str]=None
    pump_head_cover_mat : Optional[str]=None
    stage_casing_diffuser_mat : Optional[str]=None
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None


class PumpDetail_schema(Schema):
    pump_id : Optional[str] = None
    company_id : Optional[str] = None
    pump_lov_id : Optional[str] = None
    media_lov_id : Optional[str] = None
    mat_lov_id : Optional[str] = None
    motor_lov_id : Optional[str] = None
    shaft_seal_lov_id : Optional[str] = None

    company_code : Optional[str] = None
    customer_industry_group : Optional[str] = None
    company_name_en : Optional[str] = None
    address_en : Optional[str] = None
    company_name_th : Optional[str] = None
    address_th : Optional[str] = None
    map : Optional[str] = None
    province : Optional[str] = None
    sales_area : Optional[str] = None
    doc_customer : Optional[str] = None
    doc_no : Optional[str] = None
    doc_date : Optional[str] = None
    tag_no : Optional[str] = None
    serial_no : Optional[str] = None

    #Pump detail LOV
    pump_code_name : Optional[str] = None
    pump_brand : Optional[str] = None
    pump_model : Optional[str] = None
    pump_model_size : Optional[str] = None
    pump_design : Optional[str] = None
    pump_standard : Optional[str] = None
    pump_standard_no : Optional[str] = None
    pump_flange_con_std : Optional[str] = None
    pump_type_name : Optional[str] = None
    pump_stage : Optional[str] = None
    pump_seal_chamber : Optional[str] = None
    pump_oil_seal : Optional[str] = None
    pump_max_temp : Optional[str] = None
    pump_suction_size_id : Optional[str] = None
    pump_suction_size : Optional[str] = None
    pump_suction_rating : Optional[str] = None
    pump_discharge_size_id : Optional[str] = None
    pump_discharge_size : Optional[str] = None
    pump_discharge_rating : Optional[str] = None
    pump_impeller_max_size : Optional[str] = None
    pump_impeller_type : Optional[str] = None
    base_plate_id : Optional[str] = None
    base_plate : Optional[str] = None
    location : Optional[str] = None
    pump_status : Optional[str] = None

    #Pump Technical details
    design_impeller_dia : Optional[str] = None
    max_temp : Optional[str] = None
    pump_speed : Optional[str] = None
    pump_speed_unit : Optional[str] = None
    min_flow : Optional[str] = None
    min_flow_unit : Optional[str] = None
    design_flow : Optional[str] = None
    design_flow_unit : Optional[str] = None
    max_flow : Optional[str] = None
    max_flow_unit : Optional[str] = None
    bep_flow : Optional[str] = None
    bep_flow_unit : Optional[str] = None
    shut_off_head : Optional[str] = None
    shut_off_head_unit : Optional[str] = None
    min_head : Optional[str] = None
    min_head_unit : Optional[str] = None
    design_head : Optional[str] = None
    design_head_unit : Optional[str] = None
    max_head : Optional[str] = None
    max_head_unit : Optional[str] = None
    bep_head : Optional[str] = None
    bep_head_unit : Optional[str] = None
    npshr : Optional[str] = None
    npshr_unit : Optional[str] = None
    pump_efficiency : Optional[str] = None
    pump_efficiency_unit : Optional[str] = None
    hyd_power : Optional[str] = None
    hyd_power_unit : Optional[str] = None
    power_min_flow : Optional[str] = None
    power_min_flow_unit : Optional[str] = None
    power_required_cal : Optional[str] = None
    power_required_cal_unit : Optional[str] = None
    power_max_flow : Optional[str] = None
    power_max_flow_unit : Optional[str] = None
    power_bep_flow : Optional[str] = None
    power_bep_flow_unit : Optional[str] = None

    #Pump Application Data 
    media_name : Optional[str] = None
    media_density : Optional[str] = None
    media_density_unit : Optional[str] = None
    media_viscosity : Optional[str] = None
    media_viscosity_unit : Optional[str] = None
    media_concentration_percentage : Optional[str] = None
    operating_temperature : Optional[str] = None
    vapor_pressure : Optional[str] = None
    vapor_pressure_unit : Optional[str] = None
    solid_type : Optional[str] = None
    solid_diameter : Optional[str] = None
    solid_percentage : Optional[str] = None

    #Motor General Details
    motor_code_name : Optional[str] = None
    motor_model : Optional[str] = None
    motor_brand : Optional[str] = None
    motor_drive : Optional[str] = None
    motor_standard : Optional[str] = None
    motor_ie : Optional[str] = None
    motor_speed : Optional[str] = None
    motor_speed_unit : Optional[str] = None
    motor_rated : Optional[str] = None
    motor_rated_unit : Optional[str] = None
    motor_factor : Optional[str] = None
    motor_connection : Optional[str] = None
    motor_phase : Optional[str] = None
    motor_efficiency : Optional[str] = None
    motor_efficiency_unit : Optional[str] = None
    motor_rated_current : Optional[str] = None
    motor_rated_current_unit : Optional[str] = None
    motor_serial_no : Optional[str] = None
    voltage : Optional[str] = None
    voltage_unit : Optional[str] = None
    suggest_motor : Optional[str] = None
    coup_type : Optional[str] = None

    #Material and Impeller Details
    mat_code_name : Optional[str] = None
    pump_type_mat : Optional[str] = None
    pump_mat_code : Optional[str] = None
    casing_mat : Optional[str] = None
    casing_cover_mat : Optional[str] = None
    impeller_mat : Optional[str] = None
    liner_mat : Optional[str] = None
    pump_base_mat : Optional[str] = None
    pump_head_mat : Optional[str] = None
    pump_head_cover_mat : Optional[str] = None
    stage_casing_diffuser_mat : Optional[str] = None
    
    #Mechanical Seal Details
    shaft_seal_code_name : Optional[str] = None
    shaft_seal_design : Optional[str] = None
    shaft_seal_brand : Optional[str] = None
    shaft_seal_model : Optional[str] = None
    shaft_seal_material : Optional[str] = None
    mech_size : Optional[str] = None
    mech_size_unit : Optional[str] = None
    seal_cham : Optional[str] = None
    mechanical_seal_api_plan : Optional[str] = None
    mech_main_pre : Optional[str] = None
    mech_main_pre_unit : Optional[str] = None
    mech_main_temp : Optional[str] = None

    #Bearing Detail
    bearing_nde_one : Optional[str] = None
    bearing_nde_two : Optional[str] = None
    bearing_de_one : Optional[str] = None
    bearing_de_two : Optional[str] = None
    bearing_lubric_type : Optional[str] = None
    bearing_lubric_brand : Optional[str] = None
    bearing_lubric_no : Optional[str] = None
    oil_seal : Optional[str] = None
    rotation_de : Optional[str] = None
    bearing_last_chg_dt : Optional[str] = None

    tank_position : Optional[str] = None
    tank_design : Optional[str] = None
    tank_pressure : Optional[str] = None

    #Flange Details
    flang_con_std : Optional[str] = None
    pump_suction_rating: Optional[str] = None
    pump_suction_size: Optional[str] = None
    suction_pipe_id : Optional[str] = None
    suction_pipe_id_unit : Optional[str] = None
    suction_pipe_sch : Optional[str] = None
    suction_pipe_size : Optional[str] = None
    suction_pipe_length : Optional[str] = None
    suction_pipe_length_unit : Optional[str] = None
    suction_elbow : Optional[str] = None
    suction_tee : Optional[str] = None
    suction_reducer : Optional[str] = None
    suction_valve : Optional[str] = None
    suction_y_strainer : Optional[str] = None
    suction_other : Optional[str] = None
    suction_equi_length : Optional[str] = None
    suction_head : Optional[str] = None
    suction_head_unit : Optional[str] = None
    suction_velo : Optional[str] = None
    suction_velo_unit : Optional[str] = None
    pump_discharge_rating : Optional[str] = None
    pump_discharge_size: Optional[str] = None
    discharge_pipe_sch : Optional[str] = None
    discharge_pipe_size : Optional[str] = None
    discharge_pipe_id : Optional[str] = None
    discharge_pipe_id_unit : Optional[str] = None
    discharge_pipe_length_h : Optional[str] = None
    discharge_pipe_length_h_unit : Optional[str] = None
    discharge_pipe_length_v : Optional[str] = None
    discharge_pipe_length_v_unit : Optional[str] = None
    discharge_elbow : Optional[str] = None
    discharge_tee : Optional[str] = None
    discharge_reducer : Optional[str] = None
    discharge_valve : Optional[str] = None
    discharge_y_strainer : Optional[str] = None
    discharge_other : Optional[str] = None
    discharge_equi_length : Optional[str] = None
    discharge_head : Optional[str] = None
    discharge_velo : Optional[str] = None
    discharge_velo_unit : Optional[str] = None

    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None


class MediaLOV_schema(Schema):
    media_lov_id : Optional[UUID]=Field(default_factory=uuid4)
    media_name : Optional[str]=None
    media_density : Optional[str]=None
    media_density_unit : Optional[str]=None
    media_viscosity : Optional[str]=None
    media_viscosity_unit : Optional[str]=None
    media_concentration_percentage : Optional[str]=None
    operating_temperature : Optional[str]=None
    vapor_pressure : Optional[str]=None
    vapor_pressure_unit : Optional[str]=None

    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None