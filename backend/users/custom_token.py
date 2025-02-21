from typing import Type, Dict
from ninja_jwt.schema import TokenObtainInputSchemaBase
from ninja import Schema
from ninja_jwt.tokens import RefreshToken

class UserSchema(Schema):
    user_email: str
    user_role: str

class MyTokenObtainPairOutSchema(Schema):
    refresh: str
    access: str
    user: UserSchema

class MyTokenObtainPairInputSchema(TokenObtainInputSchemaBase):
    @classmethod
    def get_response_schema(cls) -> Type[Schema]:
        return MyTokenObtainPairOutSchema

    @classmethod
    def get_token(cls, user) -> Dict:
        values = {}
        refresh = RefreshToken.for_user(user)
        values["refresh"] = str(refresh)
        values["access"] = str(refresh.access_token)

        # Manually extract user data
        values["user"] = {
            "user_email": user.user_email,
            "user_role": user.user_role 
        }

        return values