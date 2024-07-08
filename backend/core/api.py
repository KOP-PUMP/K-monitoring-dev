from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_extra import NinjaExtraAPI

from pumps.api import PumpDetailController, EngineeringDetailController, DropDownDataController

api = NinjaExtraAPI()

# api.add_router("/pumps/", pumps_router)
api.register_controllers(
    PumpDetailController,
    EngineeringDetailController,
    DropDownDataController,
)
api.register_controllers(NinjaJWTDefaultController)