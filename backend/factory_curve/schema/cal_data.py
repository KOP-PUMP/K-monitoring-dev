from pydantic import BaseModel
from typing import List, Optional

class CurveDataAtImpDia_schema(BaseModel):
    flow: float
    head: float
    kw: Optional[float] = None
    imp_dia: float

class FactoryCurveCalData_schema(BaseModel):
    BEP_head: float
    BEP_flow: float
    min_flow: float
    max_flow: float
    hyd_power: float
    efficiency: int
    power_required_cal: float
    power_BEP_flow: float
    npshr: float
    min_head: float
    max_head: float
    shut_off_head: float
    eff_min_flow: int
    power_min_flow: float
    eff_max_flow: int
    power_max_flow: float
    curve: List[CurveDataAtImpDia_schema] 