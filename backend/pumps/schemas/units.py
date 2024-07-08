from ninja import Schema

class DensityUnit(Schema):
    id: int
    density_unit: str

class VicosityUnit(Schema):
    id: int
    viscosity_unit: str

class FlowUnit(Schema):
    id: int
    flow_unit: str

class PumpSpeedUnit(Schema):
    id: int
    pump_speed_unit: str

class HeadUnit(Schema):
    id: int
    head_unit: str

class NpshrUnit(Schema):
    id: int
    npshr_unit: str

class PowerUnit(Schema):
    id: int
    power_unit: str

class VoltageUnit(Schema):
    id: int
    voltage_unit: str

class PumpEfficiencyUnit(Schema):
    id: int
    pump_efficiency_unit: str

class MechSealSizeUnit(Schema):
    id: int
    mech_size_unit: str

class PressureGaugeUnit(Schema):
    id: int
    pres_gauge_unit: str

class PressureUnit(Schema):
    id: int
    pres_unit: str

class CurrentUnit(Schema):
    id: int
    current_unit: str

class VibrationUnit(Schema):
    id: int
    vibration_unit: str

class AccelerationUnit(Schema):
    id: int
    acceleration_unit: str

class TemperatureUnit(Schema):
    id: int
    temp_unit: str

class VelocityUnit(Schema):
    id: int
    velocity_unit: str

class VaporPressureUnit(Schema):
    id: int
    vapor_pres_unit: str

class UnitsData(Schema):
    density_units: list[DensityUnit]
    viscosity_units: list[VicosityUnit]
    flow_units: list[FlowUnit]
    pump_speed_units: list[PumpSpeedUnit]
    head_units: list[HeadUnit]
    npshr_units: list[NpshrUnit]
    power_units: list[PowerUnit]
    voltage_units: list[VoltageUnit]
    pump_efficiency_units: list[PumpEfficiencyUnit]
    mech_seal_size_units: list[MechSealSizeUnit]
    pressure_gauge_units: list[PressureGaugeUnit]
    pressure_units: list[PressureUnit]
    current_units: list[CurrentUnit]
    vibration_units: list[VibrationUnit]
    acceleration_units: list[AccelerationUnit]
    temperature_units: list[TemperatureUnit]
    velocity_units: list[VelocityUnit]
    vapor_pressure_units: list[VaporPressureUnit]