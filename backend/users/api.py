from ninja_extra import api_controller, http_get, http_post, http_put, http_delete
from ninja_jwt.authentication import JWTAuth

from .models import CustomUser
from .schema import UserProfileData

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