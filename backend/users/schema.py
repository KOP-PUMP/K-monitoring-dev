from pydantic import EmailStr, Field
from typing import Optional
from ninja import Schema

class UserProfileData(Schema):
    username: str = Field(max_length=50)
    email: EmailStr
    role: str = Field(max_length=30)
    phone: str = Field(max_length=30)
    surname: Optional[str] = Field(max_length=50, default=None)
    lastname: Optional[str] = Field(max_length=50, default=None)
    user_customer: Optional[str] = Field(max_length=100, default=None)
    user_address: Optional[str] = Field(max_length=50, default=None)
    user_image: Optional[str] = Field(max_length=10, default=None)


class CustomerPumpData(Schema):
    owned_pumps: int

class CustomerData(Schema):
    id: int
    username: str
    email: EmailStr
    phone: str
    pump_data: CustomerPumpData