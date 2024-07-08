from ninja import Schema

class DensityUnit(Schema):
    density_unit: str

class VicosityUnit(Schema):
    viscosity_unit: str

class FlowUnit(Schema):
    flow_unit: str

class PumpSpeedUnit(Schema):
    pump_speed_unit: str

class HeadUnit(Schema):
    head_unit: str

class NpshrUnit(Schema):
    npshr_unit: str

class PowerUnit(Schema):
    power_unit: str

class VoltageUnit(Schema):
    voltage_unit: str

class PumpEfficiencyUnit(Schema):
    pump_efficiency_unit: str

class MechSealSizeUnit(Schema):
    mech_size_unit: str

class PressureGaugeUnit(Schema):
    pres_gauge_unit: str

class PressureUnit(Schema):
    pres_unit: str

class CurrentUnit(Schema):
    current_unit: str

class VibrationUnit(Schema):
    vibration_unit: str

class AccelerationUnit(Schema):
    acceleration_unit: str

class TemperatureUnit(Schema):
    temp_unit: str

class VelocityUnit(Schema):
    velocity_unit: str

class VaporPressureUnit(Schema):
    vapor_pres_unit: str

class UnitsData(DensityUnit, VicosityUnit, FlowUnit, PumpSpeedUnit, HeadUnit, NpshrUnit, PowerUnit, VoltageUnit, PumpEfficiencyUnit, MechSealSizeUnit, PressureGaugeUnit, PressureUnit, CurrentUnit, VibrationUnit, AccelerationUnit, TemperatureUnit, VelocityUnit, VaporPressureUnit):
    pass    