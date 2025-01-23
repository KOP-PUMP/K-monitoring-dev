import logging
from typing import List

from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth

from users.models import CustomUser
from pumps.models import PumpDetail
from .schema import UserProfileData, CustomerData
from users.schemas.companies import Companies_Schema, ContactsPerson_Schema
from users.models import CompaniesDetail, ContactPersonDetail
from django.forms.models import model_to_dict

logger = logging.getLogger(__name__)

@api_controller('/users', tags=['User'], auth=JWTAuth())
class UserProfileController:
    @http_get('/profile', response=UserProfileData)
    def get_user_profile(self, request):
        user = CustomUser.objects.get(id=request.user.id)
        data = {
            'username': user.username,
            'email': user.email,
            'role': user.profile.role,
            'phone': user.profile.phone,
            'surname': user.profile.surname,
            'lastname': user.profile.lastname,
            'user_customer': user.profile.user_customer,
            'user_address': user.profile.user_address,
            'user_image': user.profile.user_image
        }
        return data


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

    @http_get('/contacts/{code}', response = list[ContactsPerson_Schema], auth=JWTAuth())
    def get_contacts(self, request, code: str):
        data = get_object_or_404(ContactPersonDetail, customer_code=code)
        return [data]
      