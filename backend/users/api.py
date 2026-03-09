import logging
from typing import List

from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth

from users.models import CustomUser
from .schemas.users import CustomerPumpData, UserProfileData, CustomerData, UserCreateWithProfileSchema
from users.schemas.companies import Companies_Schema
from users.schemas.users import UserOnlyOut
from users.models import CompaniesDetail, UserProfile, CustomUser
from django.forms.models import model_to_dict
from django.core.exceptions import ValidationError


logger = logging.getLogger(__name__)


@api_controller('/users', tags=['User'])
class UserProfileController:
    @http_get('/profile')
    def get_user_profile(self, request, user_role: str):
        users = CustomUser.objects.all()

        if user_role == 'Customer':
            users = users.filter(user_role='Customer')
        elif user_role == 'Member':
            users = users.filter(user_role='Engineer') | users.filter(user_role='Service')
        else:
            return {"error": "Invalid user role"}, 400

        response_data = []
        
        for user in users:
            response_data.append({
            'user_email': user.user_email,
            'user_role': user.user_role,
            'user_mobile': user.profile.user_mobile,
            'user_tel': user.profile.user_tel,
            'user_name': user.profile.user_name,
            'user_pec_code': user.profile.user_pec_code,
            'user_company_code': user.profile.user_company_code,
            'created_by': user.profile.created_by,
            'created_at': user.profile.created_at,
            'updated_by': user.profile.updated_by,
            'updated_at': user.profile.updated_at,
        })
        return response_data
        

    @http_post('/profile')
    def create_user_with_profile(self, request, payload: UserCreateWithProfileSchema):
        try:
            
            user = CustomUser.objects.create_user(
                user_username=payload.user_username,
                user_email=payload.user_email,
                user_password=payload.user_password,
                user_role=payload.user_role
            )

            profile, created = UserProfile.objects.get_or_create(user=user)

            if payload.profile:
                profile = user.profile     
                profile.user_mobile = payload.profile.user_mobile
                profile.user_tel = payload.profile.user_tel
                profile.user_name = payload.profile.user_name
                profile.user_pec_code = payload.profile.user_pec_code
                profile.user_company_code = payload.profile.user_company_code
                profile.created_by = payload.profile.created_by
                profile.updated_by = payload.profile.updated_by
                profile.save()

            return JsonResponse({"success": True, "message": "User created successfully"}, status=200)
        except Exception as e:
            logger.error(f'Error creating user: {e}')
            raise ValidationError(
                    {'error': f'Error creating user: {e}'}
                )
    
@api_controller('/companies', tags=['Companies'], auth=JWTAuth())
class CompaniesController:
    @http_get('/', response = list[Companies_Schema])
    def get_companies(self, request):
        return CompaniesDetail.objects.all()
    
    @http_get('/{code}', response = Companies_Schema)
    def get_company(self, request, code: str):
        company = get_object_or_404(CompaniesDetail.objects.values(), customer_code=code)
        return company
    
    @http_delete('/{code}', auth=JWTAuth())
    def delete_companies(self, request, code: str):
        contact_data = CompaniesDetail.objects.get(customer_code=code)
        contact_data.delete()
        return JsonResponse({"success": True, "message": "Company deleted successfully and related contacts deleted"}, status=200)
        
    @http_post('/', response=list[Companies_Schema])
    def create_companies(self, request, payload: Companies_Schema):
        lov = CompaniesDetail.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Company created successfully"}, status=200)

    @http_put('/{code}', response = list[Companies_Schema])
    def update_companies(self, request, code: str, payload: Companies_Schema):
        data = get_object_or_404(CompaniesDetail, customer_code=code)
        for attr, value in payload.dict(exclude={"company_id","pk"}).items():
            setattr(data, attr, value)
        data.save()
        return data
    
@api_controller('/customers', tags=['Customer'])
class CustomerController:
    @http_get('/')
    def get_customers(self, request):
        customers = UserProfile.objects.filter(user__user_role='Customer')
        
        def get_company_data(company_code):
            try:
                data = CompaniesDetail.objects.get(customer_code=company_code)
                data_dict = model_to_dict(data)
                response_data = {
                    'customer_code': data_dict['customer_code'],
                    'customer_industry_group': data_dict['customer_industry_group'],
                    'company_name_en': data_dict['company_name_en'],
                    'address_en': data_dict['address_en'],
                    'company_name_th': data_dict['company_name_th'],
                    'address_th': data_dict['address_th'],
                    'map': data_dict['map'],
                    'province': data_dict['province'],
                    'sales_area': data_dict['sales_area']
                }
                return response_data
            except CompaniesDetail.DoesNotExist:
                return {}
        
        response_data = []
        for profile in customers:
            user_data = profile.user
            response_data.append({
                'user_name': profile.user_name,
                'email': user_data.user_email,
                'mobile': profile.user_mobile,
                'tel': profile.user_tel,
                'company_data': get_company_data(profile.user_company_code),
                'is_active': user_data.is_active
                }
            )
        
        return response_data

      