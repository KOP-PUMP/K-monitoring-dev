from datetime import datetime
from ninja import Schema

class ImpellerListSchema(Schema):
    impeller_type_id: int
    impeller_type_name: str

class MechSealApiPlanListSchema(Schema):
    mech_api_id: int
    mech_api_plan: str

class BearingListSchema(Schema):
    rotation_de_id: int
    rotation: str

class CasingMaterialListSchema(Schema):
    mat_cover_id: int
    mat_cover_name: str
    mat_cover_type: str

class FlangRatingListSchema(Schema):
    flang_rating_id: int
    flang_rating_name: str

class MechanicalDesignListSchema(Schema):
    mech_design_id: int
    mech_design_name: str

class PumpDetailListSchema(Schema):
    pump_id: int
    pump_design: str
    pump_type: str

class MotorDetailListSchema(Schema):
    motor_drive_id: int
    drive_system: str | None = None
    ie_class: str | None = None
    standard: str | None = None

class SuctionPipeInfoListSchema(Schema):
    pipe_lov_id: int
    pipe_sch: str
    pipe_size: str
    pipe_id: str
    fac_number: str
    equipment: str
    brand: str
    short_model: str
    model: str
    data_type: str
    sequence: int
    rpm: int
    imp_dia: float
    flow: float
    head: float
    eff: int
    npshr: float
    kw: float
    curve_format: str
    eff_rl: str
    eff_status: int
    eff_distance: float
    tolerance: int
    scale_xy: float
    update_time: datetime
    dry_sat: str
    liquid: float

class PumpStandardListSchema(Schema):
    pump_standard_id: int
    name: str

class SuctionDischargeDetailListSchema(Schema):
    id: int
    suction_discharge_value: str

class FaceMaterialDetailListSchema(Schema):
    mat_face_id: int
    mat_face_name: str
    mat_face_type: str

class SpringMaterialDetailListSchema(Schema):
    mat_spring_id: int
    mat_spring_name: str
    mat_spring_type: str

class VibrationDetailListSchema(Schema):
    voltage: str
    acceptable: str
    unsatisfied: str
    unacceptable: str

class DropDownData(Schema):
    impeller_list: list[ImpellerListSchema]
    mech_seal_api_plan_list: list[MechSealApiPlanListSchema]
    bearing_list: list[BearingListSchema]
    casing_material_list: list[CasingMaterialListSchema]
    flang_rating_list: list[FlangRatingListSchema]
    mechanical_design_list: list[MechanicalDesignListSchema]
    pump_detail_list: list[PumpDetailListSchema]
    motor_detail_list: list[MotorDetailListSchema]
    suction_pipe_info_list: list[SuctionPipeInfoListSchema]
    pump_standard_list: list[PumpStandardListSchema]
    suction_discharge_detail_list: list[SuctionDischargeDetailListSchema]
    face_material_detail : list[FaceMaterialDetailListSchema]
    spring_material_detail : list[SpringMaterialDetailListSchema]
    vibration_detail : list[VibrationDetailListSchema]


