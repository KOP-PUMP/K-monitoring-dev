import logging
from typing import List

from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth

from users.models import CustomUser
from pumps.models import PumpDetail
from .schemas.users import UserProfileData, CustomerData, UserCreateWithProfileSchema
from users.schemas.companies import Companies_Schema
from users.models import CompaniesDetail, UserProfile, CustomUser
from django.forms.models import model_to_dict
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

@api_controller('/users', tags=['User'], auth=JWTAuth())
class UserProfileController:
    @http_get('/profile', response=UserProfileData)
    def get_user_profile(self, request):
        user = CustomUser.objects.select_related('profile').get(id=request.user.id)
        if not hasattr(user, 'profile'):
            return {"error" : "User profile not found"}, 404
        data = {
            'user_username': user.user_username,
            'user_email': user.user_email,
            'user_mobile': user.profile.user_mobile,
            'user_tel': user.profile.user_tel,
            'user_name': user.profile.user_name,
            'user_pec_code': user.profile.user_pec_code,
            'user_company_code': user.profile.user_company_code,
            'user_role': user.profile.user_role,
            'created_by': user.profile.created_by,
            'created_at': user.profile.created_at,
            'updated_by': user.profile.updated_by,
            'updated_at': user.profile.updated_at,
        }
        return data
    @http_post('/profile')
    def create_user_with_profile(self, request, payload: UserCreateWithProfileSchema):
        try:
            user = CustomUser.objects.create_user(
                user_username=payload.user_username,
                user_email=payload.user_email,
                user_password=payload.user_password
            )

            profile, created = UserProfile.objects.get_or_create(user=user)

            if payload.profile:
                profile = user.profile     
                profile.user_mobile = payload.profile.user_mobile
                profile.user_tel = payload.profile.user_tel
                profile.user_name = payload.profile.user_name
                profile.user_pec_code = payload.profile.user_pec_code
                profile.user_company_code = payload.profile.user_company_code
                profile.user_role = payload.profile.user_role
                profile.created_by = payload.profile.created_by
                profile.updated_by = payload.profile.updated_by
                profile.save()

            return JsonResponse({"success": True, "message": "User created successfully"}, status=200)
        except Exception as e:
            logger.error(f'Error creating user: {e}')
            raise ValidationError(
                    {'error': f'Error creating user: {e}'}
                )
    

@api_controller('/customers/', tags=['Customer'])
class CustomerController:
    @http_get('/', response=List[CustomerData])
    def get_customers(self, request):
        try:
            customer_group = get_object_or_404(Group, name='customer')
            customers = CustomUser.objects.filter(groups=customer_group)
            data = []
            for customer in customers:
                profile = customer.profile
                data.append({
                    'id': customer.id,
                    'username': customer.username,
                    'email': customer.email,
                    'phone': profile.phone,
                    'pump_data': {
                        'owned_pumps': PumpDetail.objects.filter(user=customer).count(),
                    }
                })
            return data
        except Group.DoesNotExist:
            return {'error': 'Customer group does not exist'}, 404
        except Exception as e:
            logger.error(f'Error retrieving customers: {e}')
            return {'error': str(e)}, 500
    
@api_controller('/companies', tags=['Companies'], auth=JWTAuth())
class CompaniesController:
    @http_get('/', response = list[Companies_Schema])
    def get_companies(self, request):
        return CompaniesDetail.objects.all()
    
    @http_get('/{code}')
    def get_company(self, request, code: str):
        data = get_object_or_404(CompaniesDetail, customer_code=code)
        data = model_to_dict(data)
        return data
    
    @http_delete('/{code}', auth=JWTAuth())
    def delete_companies(self, request, code: str):
        contact_data = CompaniesDetail.objects.get(customer_code=code)
        contact_data.delete()
        return JsonResponse({"success": True, "message": "Company deleted successfully and related contacts deleted"}, status=200)
        
    @http_post('/', response=list[Companies_Schema]  )
    def create_companies(self, request, payload: Companies_Schema):
        lov = CompaniesDetail.objects.create(**payload.dict())
        return JsonResponse({"success": True, "message": "Company created successfully"}, status=200)

    @http_put('/{code}', response = list[Companies_Schema])
    def update_companies(self, request, code: str, payload: Companies_Schema):
        data = get_object_or_404(CompaniesDetail, customer_code=code)
        for attr, value in payload.dict(exclude={"customer_id","pk"}).items():
            setattr(data, attr, value)
        data.save()
        return data

      