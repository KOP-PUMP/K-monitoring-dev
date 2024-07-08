from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_extra import NinjaExtraAPI

from pumps.api import PumpDetailController, EngineeringDetailController, DropDownDataController, UnitDataController
from users.api import UserProfileController

api = NinjaExtraAPI()

# api.add_router("/pumps/", pumps_router)
api.register_controllers(
    PumpDetailController,
    EngineeringDetailController,
    DropDownDataController,
    UnitDataController,
    UserProfileController
)
api.register_controllers(NinjaJWTDefaultController)