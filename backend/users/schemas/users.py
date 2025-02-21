from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime
from ninja import Schema

class UserProfileData(Schema):
    user_username: str = Field(max_length=50)
    user_email: EmailStr
    user_mobile: str = Field(max_length=30)
    user_tel: str = Field(max_length=30)
    user_name: Optional[str] = Field(max_length=50, default=None)
    user_pec_code: Optional[str] = Field(max_length=50, default=None)
    user_company_code: Optional[str] = Field(max_length=50, default=None)
    created_at: Optional[datetime] = Field(None)
    created_by: Optional[str] = Field(max_length=50, default=None)
    updated_at: Optional[datetime] = Field(None)
    updated_by: Optional[str] = Field(max_length=50, default=None)
    
class CustomerPumpData(Schema):
    owned_pumps: int

class CustomerData(Schema):
    id: int
    username: str
    email: EmailStr
    phone: str
    pump_data: CustomerPumpData

class UserCreateWithProfileSchema(Schema):
    user_email : EmailStr
    user_username : str
    user_password : str
    user_role: str = Field(max_length=30)
    profile: Optional[UserProfileData] = None