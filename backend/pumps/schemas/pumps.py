from datetime import datetime
from ninja import Schema
from ninja.orm import create_schema

from pumps.models import EngineeringDetail

EngineeringDetailIn = create_schema(model=EngineeringDetail)
EngineeringDetailOut = create_schema(model=EngineeringDetail)

class PumpCustomerDetail(Schema):
    doc_customer: str
    doc_no: str
    doc_date: str

class PumpGeneralDetail(Schema):
    location: str = None
    brand: str
    model: str
    tag_no: str
    serial_no: str
    pump_standard_id: str
    pump_standard: str
    pump_type_id: str
    pump_type_name: str
    stage: int = None
    pump_design: str

class PumpOtherGeneralDetail(Schema):
    design_temp: str
    max_temp: str
    density: float
    density_unit: str
    max_flow: float
    max_flow_unit: str
    min_flow: float
    min_flow_unit: str
    suction_velo: str
    suction_velo_unit: str
    discharge_velo: str
    discharge_velo_unit: str
    bep_head: float
    bep_head_unit: str
    bep_flow: str
    bep_flow_unit: str
    hyd_power: float
    hyd_power_unit: str
    voltage: str
    voltage_unit: str
    power_required_cal: str
    power_required_cal_unit: str
    power_min_flow: float
    power_min_flow_unit: str
    power_max_flow: float
    power_max_flow_unit: str
    power_bep_flow: float
    power_bep_flow_unit: str
    suggest_motor: float
    tank_position: str = None
    tank_design: str = None
    tank_pressure: float = None
    suction_head: float = None
    suction_pipe_length: float = None
    discharge_pipe_length_h: float = None
    discharge_pipe_length_v: float = None
    suction_pipe_id: int
    discharge_pipe_id: str
    suction_elbow: int = None
    suction_tee: int = None
    suction_reducer: int = None
    suction_valve: int = None
    suction_y_strainer: int = None
    suction_other: int = None
    suction_equi_length: float = None
    discharge_equi_length: float = None
    discharge_elbow: int = None
    discharge_tee: int = None
    discharge_reducer: int = None
    discharge_valve: int = None
    discharge_y_strainer: int = None
    discharge_other: int = None
    diffuser_mat_id: int = None
    diffuser_mat: int = None
    materials_wear_ring_id: int = None
    materials_wear_ring: str = None
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
    concentration: float = None
    pump_status: str

class PumpMaterialDetail(Schema):
    casing_mat_id: int = None
    casing_mat: str = None
    impeller_mat_id: int = None
    impeller_mat: str = None
    shaft_mat_id: int = None
    shaft_mat: str = None

class PumpApplicationData(Schema):
    media: str
    viscosity: float
    viscosity_unit: str
    vapor_pressure: float
    vapor_pressure_unit: str
    solid_type: str = None
    solid_diameter: str = None

class PumpMotorGeneralDetail(Schema):
    motor_brand: str = None
    motor_model: str = None
    motor_serial_no: str = None
    motor_drive_id: int = None
    motor_drive: str = None
    motor_frame: str = None
    motor_protection: str = None
    motor_standard: str = None
    motor_ie: str = None
    motor_speed: float
    motor_speed_unit: str
    motor_rated: float
    motor_rated_unit: str
    motor_factor: float
    motor_connection: str = None
    motor_phase: int
    motor_efficiency: str
    motor_efficiency_unit: str

class PumpCouplingDetails(Schema):
    coup_model: str = None
    coup_brand: str = None
    coup_type: str
    coup_size: str = None
    coup_spacer: float = None

class PumpImpellerDetails(Schema):
    impeller_type_id: int = None
    # impeller_type: str = None
    design_impeller_dia: float
    impeller_max: float = None

class PumpTechnicalData(Schema):
    pump_speed: float
    pump_speed_unit: str
    pump_efficiency: str
    pump_efficiency_unit: str
    min_head: str
    min_head_unit: str
    max_head: str
    max_head_unit: str
    npshr: str
    npshr_unit: str
    design_flow: str
    design_flow_unit: str
    design_head: str
    design_head_unit: str

class PumpMechanicalSealGeneralDetails(Schema):
    mech_seal_cham: str = None

class PumpMechanicalSealDetails(Schema):
    mech_api_id: str
    mech_api_plan: str = None
    mech_main_temp: float = None
    mech_main_pre: float = None
    mech_brand: str = None
    mech_model: str = None
    mech_size: float = None
    mech_size_unit: str = None
    mech_design_id: int = None
    mech_design: str = None
    mech_material: str = None

class PumpFlangeDetails(Schema):
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

class PumpBearingDetails(Schema):
    rotation_de_id: int
    rotation_de: str
    bearing_nde: str = None
    bearing_num: str = None
    bearing_lubric_type: str = None
    bearing_lubric_brand: str = None
    bearing_lubric_no: str = None
    bearing_de: str = None
    bearing_de_no: str = None
    bearing_last_chg_dt: datetime = None

class PumpDetailIn(PumpCustomerDetail, PumpGeneralDetail, PumpOtherGeneralDetail, PumpMaterialDetail,
                   PumpApplicationData, PumpMotorGeneralDetail, PumpCouplingDetails, 
                   PumpImpellerDetails, PumpTechnicalData, PumpMechanicalSealGeneralDetails,
                   PumpMechanicalSealDetails, PumpFlangeDetails, PumpBearingDetails):
    """
    Combined schema for all pump details (except pump_id, it's scheme for new data).
    Inherits fields from multiple schemas to create a comprehensive input schema.
    """
    pass

class PumpDetailOut(PumpDetailIn):
    """
    Combined schema for all pump details.
    """
    pump_id: int