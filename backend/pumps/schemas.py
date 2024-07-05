from datetime import datetime
from ninja import Schema
from ninja.orm import create_schema

from pumps.models import EngineeringDetail

EngineeringDetailIn = create_schema(model=EngineeringDetail)
EngineeringDetailOut = create_schema(model=EngineeringDetail)

class PumpDetailIn(Schema):
    doc_customer: str
    doc_no: str
    doc_date: str
    brand: str
    model: str
    tag_no: str
    pump_type_id: str
    pump_type_name: str
    serial_no: str
    media: str
    pump_standard_id: str
    pump_standard: str
    pump_design: str
    stage: int = None
    location: str = None
    design_temp: str
    max_temp: str
    solid_type: str = None
    solid_diameter: str = None
    density: float
    density_unit: str
    viscosity: float
    viscosity_unit: str
    max_flow: int
    max_flow_unit: str
    min_flow: int
    min_flow_unit: str
    vapor_pressure: float
    vapor_pressure_unit: str
    pump_speed: int
    pump_speed_unit: str
    design_flow: str
    design_flow_unit: str
    design_head: str
    design_head_unit: str
    min_head: str
    min_head_unit: str
    max_head: str
    max_head_unit: str
    suction_velo: str
    suction_velo_unit: str
    discharge_velo: str
    discharge_velo_unit: str
    bep_head: int
    bep_head_unit: str
    bep_flow: str
    bep_flow_unit: str
    npshr: str
    npshr_unit: str
    pump_efficiency: str
    pump_efficiency_unit: str
    hyd_power: float
    hyd_power_unit: str
    voltage: str
    voltage_unit: str
    power_required_cal: str
    power_required_cal_unit: str
    power_min_flow: int
    power_min_flow_unit: str
    power_max_flow: int
    power_max_flow_unit: str
    power_bep_flow: int
    power_bep_flow_unit: str
    suggest_motor: float
    pump_suction_size_id: str = None
    pump_suction_size: str = None
    pump_suction_rating_id: str = None
    pump_suction_rating: str = None
    pump_discharge_size_id: str = None
    pump_discharge_size: str = None
    pump_discharge_rating_id: str = None
    pump_discharge_rating: str = None
    suction_pipe_data_id: str
    suction_pipe_size: str
    suction_pipe_rating: str = None
    suction_pipe_sch: str
    discharge_pipe_data_id: str
    discharge_pipe_size: str
    discharge_pipe_rating: str = None
    discharge_pipe_sch: str
    tank_position: str = None
    tank_design: str = None
    tank_pressure: float = None
    suction_head: float = None
    suction_pipe_length: float = None
    discharge_pipe_length_h: int = None
    discharge_pipe_length_v: int = None
    suction_pipe_id: int
    discharge_pipe_id: str
    suction_elbow: int = None
    suction_tee: float = None
    suction_reducer: float = None
    suction_valve: float = None
    suction_y_strainer: float = None
    suction_other: float = None
    suction_equi_length: float = None
    discharge_equi_length: float = None
    discharge_elbow: int = None
    discharge_tee: float = None
    discharge_reducer: float = None
    discharge_valve: float = None
    discharge_y_strainer: float = None
    discharge_other: float = None
    casing_mat_id: int = None
    casing_mat: str = None
    shaft_mat_id: int = None
    shaft_mat: str = None
    diffuser_mat_id: int = None
    diffuser_mat: int = None
    impeller_type_id: int = None
    impeller_type: str = None
    design_impeller_dia: int
    impeller_max: int = None
    impeller_mat_id: int = None
    impeller_mat: str = None
    materials_wear_ring_id: int = None
    materials_wear_ring: str = None
    bearing_nde: str = None
    bearing_num: str = None
    bearing_lubric_type: str = None
    bearing_lubric_brand: str = None
    bearing_lubric_no: str = None
    rotation_de_id: int
    rotation_de: str
    bearing_de: str = None
    bearing_de_no: str = None
    bearing_last_chg_dt: datetime = None
    sleeve_mat_id: int = None
    sleeve_mat: str = None
    bearing_housing_mat_id: int = None
    bearing_housing_mat: str = None
    gland_mat: str = None
    casing_gas: str = None
    oring_gas: float = None
    impeller_gas: str = None
    pump_lining_mat: str = None
    base_plate: str = None
    coup_model: str = None
    coup_brand: str = None
    coup_type: str
    coup_size: str = None
    coup_spacer: int = None
    motor_brand: str = None
    motor_model: str = None
    motor_serial_no: str = None
    motor_drive_id: int = None
    motor_drive: str = None
    motor_frame: str = None
    motor_protection: str = None
    motor_standard: str = None
    motor_ie: str = None
    motor_speed: int
    motor_speed_unit: str
    motor_rated: float
    motor_rated_unit: str
    motor_factor: float
    motor_connection: str = None
    motor_phase: int
    motor_efficiency: str
    motor_efficiency_unit: str
    mech_api_id: str
    mech_api_plan: str = None
    mech_main_temp: int = None
    mech_main_pre: int = None
    mech_seal_cham: str = None
    mech_brand: str = None
    mech_model: str = None
    mech_size: int = None
    mech_size_unit: str = None
    mech_design_id: int = None
    mech_design: str = None
    mech_material: str = None
    concentration: int = None
    pump_status: str

class PumpDetailOut(Schema):
    pump_id: int
    doc_customer: str
    doc_no: str
    doc_date: str
    brand: str
    model: str
    tag_no: str
    pump_type_id: str
    pump_type_name: str
    serial_no: str
    media: str
    pump_standard_id: str
    pump_standard: str
    pump_design: str
    stage: int = None
    location: str = None
    design_temp: str
    max_temp: str
    solid_type: str = None
    solid_diameter: str = None
    density: float
    density_unit: str
    viscosity: float
    viscosity_unit: str
    max_flow: int
    max_flow_unit: str
    min_flow: int
    min_flow_unit: str
    vapor_pressure: float
    vapor_pressure_unit: str
    pump_speed: int
    pump_speed_unit: str
    design_flow: str
    design_flow_unit: str
    design_head: str
    design_head_unit: str
    min_head: str
    min_head_unit: str
    max_head: str
    max_head_unit: str
    suction_velo: str
    suction_velo_unit: str
    discharge_velo: str
    discharge_velo_unit: str
    bep_head: int
    bep_head_unit: str
    bep_flow: str
    bep_flow_unit: str
    npshr: str
    npshr_unit: str
    pump_efficiency: str
    pump_efficiency_unit: str
    hyd_power: float
    hyd_power_unit: str
    voltage: str
    voltage_unit: str
    power_required_cal: str
    power_required_cal_unit: str
    power_min_flow: int
    power_min_flow_unit: str
    power_max_flow: int
    power_max_flow_unit: str
    power_bep_flow: int
    power_bep_flow_unit: str
    suggest_motor: float
    pump_suction_size_id: str = None
    pump_suction_size: str = None
    pump_suction_rating_id: str = None
    pump_suction_rating: str = None
    pump_discharge_size_id: str = None
    pump_discharge_size: str = None
    pump_discharge_rating_id: str = None
    pump_discharge_rating: str = None
    suction_pipe_data_id: str
    suction_pipe_size: str
    suction_pipe_rating: str = None
    suction_pipe_sch: str
    discharge_pipe_data_id: str
    discharge_pipe_size: str
    discharge_pipe_rating: str = None
    discharge_pipe_sch: str
    tank_position: str = None
    tank_design: str = None
    tank_pressure: float = None
    suction_head: float = None
    suction_pipe_length: float = None
    discharge_pipe_length_h: int = None
    discharge_pipe_length_v: int = None
    suction_pipe_id: int
    discharge_pipe_id: str
    suction_elbow: int = None
    suction_tee: float = None
    suction_reducer: float = None
    suction_valve: float = None
    suction_y_strainer: float = None
    suction_other: float = None
    suction_equi_length: float = None
    discharge_equi_length: float = None
    discharge_elbow: int = None
    discharge_tee: float = None
    discharge_reducer: float = None
    discharge_valve: float = None
    discharge_y_strainer: float = None
    discharge_other: float = None
    casing_mat_id: int = None
    casing_mat: str = None
    shaft_mat_id: int = None
    shaft_mat: str = None
    diffuser_mat_id: int = None
    diffuser_mat: int = None
    impeller_type_id: int = None
    impeller_type: str = None
    design_impeller_dia: int
    impeller_max: int = None
    impeller_mat_id: int = None
    impeller_mat: str = None
    materials_wear_ring_id: int = None
    materials_wear_ring: str = None
    bearing_nde: str = None
    bearing_num: str = None
    bearing_lubric_type: str = None
    bearing_lubric_brand: str = None
    bearing_lubric_no: str = None
    rotation_de_id: int
    rotation_de: str
    bearing_de: str = None
    bearing_de_no: str = None
    bearing_last_chg_dt: datetime = None
    sleeve_mat_id: int = None
    sleeve_mat: str = None
    bearing_housing_mat_id: int = None
    bearing_housing_mat: str = None
    gland_mat: str = None
    casing_gas: str = None
    oring_gas: float = None
    impeller_gas: str = None
    pump_lining_mat: str = None
    base_plate: str = None
    coup_model: str = None
    coup_brand: str = None
    coup_type: str
    coup_size: str = None
    coup_spacer: int = None
    motor_brand: str = None
    motor_model: str = None
    motor_serial_no: str = None
    motor_drive_id: int = None
    motor_drive: str = None
    motor_frame: str = None
    motor_protection: str = None
    motor_standard: str = None
    motor_ie: str = None
    motor_speed: int
    motor_speed_unit: str
    motor_rated: float
    motor_rated_unit: str
    motor_factor: float
    motor_connection: str = None
    motor_phase: int
    motor_efficiency: str
    motor_efficiency_unit: str
    mech_api_id: str
    mech_api_plan: str = None
    mech_main_temp: int = None
    mech_main_pre: int = None
    mech_seal_cham: str = None
    mech_brand: str = None
    mech_model: str = None
    mech_size: int = None
    mech_size_unit: str = None
    mech_design_id: int = None
    mech_design: str = None
    mech_material: str = None
    concentration: int = None
    pump_status: str