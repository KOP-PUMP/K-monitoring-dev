from ninja import Schema
from uuid import UUID
from datetime import datetime
from typing import Optional

class KMonitoringLOV_schema(Schema):
    id: UUID
    type_name: str
    product_name: str
    data_value: Optional[str] = None
    data_value2: Optional[str] = None
    data_value3: Optional[str] = None
    data_value4: Optional[str] = None
    created_at: datetime
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

class PumpStandardLOV_schema(Schema):
    id: UUID
    standard_name: str
    created_at: datetime
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

class MotorDetailLOV_schema(Schema):
    id: UUID
    ie_class: str
    standard: str
    created_at: datetime
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

class PumpDetailLOV_schema(Schema):
    id: UUID
    pump_design: str
    pump_type: str
    created_at: datetime
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

class VibrationLOV_schema(Schema):
    id: UUID
    voltage: str
    acceptable: str
    unsatisfied: str
    unacceptable: str
    created_at: datetime
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

    

      