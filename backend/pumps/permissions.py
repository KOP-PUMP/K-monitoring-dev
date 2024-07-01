from django.http import HttpRequest
from ninja_extra import ControllerBase, permissions


class CanManagePump(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.manage_pump")

class CanViewPump(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.view_pumpdetail")

class CanManageEngineering(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.manage_engineering")
