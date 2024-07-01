from django.core.management.base import BaseCommand
from users.models import CustomUser
from django.contrib.auth.models import Group

class Command(BaseCommand):
    help = 'Assigns users to groups'

    def handle(self, *args, **options):
        user = CustomUser.objects.get(user_email='user@example.com')

        master_group = Group.objects.get(name='Master')
        user.groups.add(master_group)