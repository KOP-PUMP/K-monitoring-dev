from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Creates groups and assigns permissions'

    def handle(self, *args, **options):
        master_group, created = Group.objects.get_or_create(name='Master')
        engineer_group, created = Group.objects.get_or_create(name='Engineer')
        customer_group, created = Group.objects.get_or_create(name='Customer')

        content_type = ContentType.objects.get_for_model(CustomUser)

        master_permissions = ['add_customuser', 'change_customuser', 'delete_customuser', 'view_customuser']
        engineer_permissions = ['change_customer', 'view_customer']
        customer_permissions = ['view_customer']

        master_pump_permissions = ['add_pumpdetail', 'change_pumpdetail', 'delete_pumpdetail', 'view_pumpdetail']
        engineer_pump_permissions = ['change_pumpdetail', 'view_pumpdetail']
        customer_pump_permissions = ['view_pumpdetail']

        master_perm = master_permissions + master_pump_permissions
        engineer_perm = engineer_permissions + engineer_pump_permissions
        customer_perm = customer_permissions + customer_pump_permissions

        for perm in master_perm:
            permission = Permission.objects.get(codename=perm, content_type=content_type)
            master_group.permissions.add(permission)

        for perm in engineer_perm:
            permission = Permission.objects.get(codename=perm, content_type=content_type)
            engineer_group.permissions.add(permission)

        for perm in customer_perm:
            permission = Permission.objects.get(codename=perm, content_type=content_type)
            customer_group.permissions.add(permission)