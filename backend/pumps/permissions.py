from ninja_extra import permissions

class CanAddPumpDetail(permissions.BasePermission):
    def has_permission(self, request, controller):
        return request.user.has_perm('pump.add_pumpdetail')

class CanViewPumpDetail(permissions.BasePermission):
    def has_permission(self, request, controller):
        return request.user.has_perm('pump.view_pumpdetail')

class CanChangePumpDetail(permissions.BasePermission):
    def has_permission(self, request, controller):
        return request.user.has_perm('pump.change_pumpdetail')

class CanDeletePumpDetail(permissions.BasePermission):
    def has_permission(self, request, controller):
        return request.user.has_perm('pump.delete_pumpdetail')
