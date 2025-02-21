from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_extra import NinjaExtraAPI

from users.api import UserProfileController, CompaniesController
from pump_data.api import ListOfValuesController

api = NinjaExtraAPI(title="K-Monitoring API", version="1.0.0")

# api.add_router("/pumps/", pumps_router)
api.register_controllers(
    UserProfileController,
    ListOfValuesController,
    CompaniesController
)
api.register_controllers(NinjaJWTDefaultController)