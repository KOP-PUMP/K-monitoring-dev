from ninja import Schema
from uuid import UUID
from typing import Optional

class CompaniesSchema(Schema):
    customer_id: int
    customer_code : str
    customer_industry_id : UUID
    customer_industry_group : str
    company_name_en : str
    address_en : str
    company_name_th : str
    address_th : str
    map : Optional[str] = None  
    created_by : str
    created_at : str
    updated_by : str
    updated_at : str
    province_th : str
    province_en : str
    sales_area : str

class ContactsPersonSchema(Schema):
    contact_person_id : str
    customer_code : str
    name_surname_en : str
    name_surname_th : str
    position_en : str
    position_th : str
    tel : str
    mobile : str
    email : str
    time_stamp : str
    time_update : str