from ninja import Schema
from typing import Optional, List
from datetime import datetime

class FactoryCurve_schema(Schema):
    id : Optional[str] = None
    fac_number : Optional[str] = None
    equipment : Optional[str] = None
    brand : Optional[str] = None
    model_short : Optional[str] = None
    model : Optional[str] = None
    data_type : Optional[str] = None
    se_quence : Optional[str] = None
    rpm : Optional[str] = None
    imp_dia : Optional[str] = None
    flow : Optional[str] = None
    head : Optional[str] = None
    eff : Optional[str] = None
    npshr : Optional[str] = None
    kw : Optional[str] = None
    curve_format : Optional[str] = None
    eff_rl : Optional[str] = None
    eff_status : Optional[str] = None
    eff_distance : Optional[str] = None
    tolerance : Optional[str] = None
    scale_xy : Optional[str] = None
    update_time : Optional[str] = None
    dry_sat : Optional[str] = None
    liquid : Optional[str] = None

class FactoryCurveCal_schema(Schema):
    min_flow : str
    max_flow : str
    BEP_flow : str
    shut_off_head : str
    min_head : str
    max_head : str
    BEP_head : str
    npshr : str
    eff : str
    hyd_power : str
    power_min_flow : str
    power_required : str
    power_max_flow : str
    BEP_power_flow : str

class FactoryCurveNumber_schema(Schema):
    id : Optional[str] = None
    fac_number : Optional[str] = None
    created_at : Optional[datetime] = None
    created_by : Optional[str] = None
    updated_at : Optional[datetime] = None
    updated_by : Optional[str] = None


class CurveDataAtImp_schema(Schema):
    flow: str
    head: str
    kw: Optional[str]
    imp_dia: str

class CalPumpResponse_schema(Schema):
    BEP_head: str
    BEP_flow: str
    min_flow: str
    max_flow: str
    hyd_power: str
    efficiency: str
    power_required_cal: str
    power_BEP_flow:str
    npshr: str
    min_head: str
    max_head: str
    shut_off_head: str
    eff_min_flow: str
    power_min_flow:str
    eff_max_flow: str
    power_max_flow:str
    curve: List[CurveDataAtImp_schema]

class CalPumpPayload_schema(Schema):
    design_impeller_dia : str
    pump_model : str
    pump_model_size : str
    pump_speed : str
    pump_speed_unit : str
    design_flow : str
    design_flow_unit : str
    design_head : str
    design_head_unit : str
    media_name : str
    media_density : str
    media_density_unit : str
