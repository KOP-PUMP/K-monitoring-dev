from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_extra import NinjaExtraAPI

from pumps.api import PumpDetailController, EngineeringDetailController, DropDownDataController, UnitDataController, ChartDataController
from users.api import UserProfileController, CustomerController
from pump_data.api import ListOfValuesController

api = NinjaExtraAPI(title="K-Monitoring API", version="1.0.0")

# api.add_router("/pumps/", pumps_router)
api.register_controllers(
    PumpDetailController,
    EngineeringDetailController,
    DropDownDataController,
    UnitDataController,
    UserProfileController,
    ChartDataController,
    CustomerController,
    ListOfValuesController
)
api.register_controllers(NinjaJWTDefaultController)