from ninja import Schema
from uuid import UUID , uuid4
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class Companies_Schema(Schema):
    customer_id: Optional[UUID] = Field(default_factory=uuid4)
    customer_code : str
    customer_industry_id : Optional[str] = None
    customer_industry_group : Optional[str] = None
    company_name_en : str
    address_en : str
    company_name_th : str
    address_th : str
    map : Optional[str] = None  
    province: str
    sales_area : str
    created_by : str
    created_at : datetime
    updated_by : str
    updated_at : datetime


class ContactsPerson_Schema(Schema):
    contact_person_id : UUID
    customer_code : str
    name_surname_en : str
    name_surname_th : str
    position_en : str
    position_th : str
    tel : str
    mobile : str
    email : str
    time_stamp : datetime
    time_update : datetime