from ninja import Schema

class FlowPowerChartData(Schema):
    imp_dia: float
    flow: float
    kw: float

class HeadFlowChartData(Schema):
    imp_dia: float
    flow: float
    head: float

class NPSHRFlowChartData(Schema):
    imp_dia: float
    flow: float
    npshr: float

class EffHeadFlowChartData(Schema):
    eff: int
    flow: float
    head: float