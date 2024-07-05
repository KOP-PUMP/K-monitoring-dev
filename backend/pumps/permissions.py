from django.http import HttpRequest
from ninja_extra import ControllerBase, permissions

class CanAddPump(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.add_pumpdetail")

class CanChangePump(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.change_pumpdetail")

class CanDeletePump(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.delete_pumpdetail")

class CanViewPump(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.view_pumpdetail")

class CanAddEngineering(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.add_engineeringdetail")

class CanChangeEngineering(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.change_engineeringdetail")

class CanDeleteEngineering(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.delete_engineeringdetail")

class CanViewEngineering(permissions.BasePermission):
    def has_permission(self, request: HttpRequest, controller: ControllerBase) -> bool:
        return request.user.has_perm("pumps.view_engineeringdetail")
