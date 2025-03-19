from ninja import Schema
from typing import Optional
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

class FactoryCurveNumber_schema(Schema):
    id : Optional[str] = None
    fac_number : Optional[str] = None
    created_at : Optional[datetime] = None
    created_by : Optional[str] = None
    updated_at : Optional[datetime] = None
    updated_by : Optional[str] = None