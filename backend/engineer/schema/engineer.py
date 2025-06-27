from pump_data.schema.pump_lov import PumpDetail_schema
from datetime import datetime
from typing import Optional
from ninja import Schema
from uuid import UUID , uuid4
from pydantic import BaseModel, Field

class EngineerReportPayLoad_schema(Schema):
    report_id : Optional[UUID]=Field(default_factory=uuid4)
    pump_detail : Optional[UUID]=None
    user_detail : Optional[str]=None
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None

class EngineerReport_schema(Schema):
    pump_detail : Optional[str]=None
    user_detail : Optional[str]=None
    report_name : Optional[str]=None
    report_detail : Optional[str]=None
    remarks : Optional[str]=None
    report_file : Optional[str]=None
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: datetime
    updated_by: Optional[str] = None