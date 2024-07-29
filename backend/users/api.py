import logging
from typing import List

from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404

from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth

from users.models import CustomUser
from pumps.models import PumpDetail
from .schema import UserProfileData, CustomerData

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


@api_controller('/customers', tags=['Customer'])
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