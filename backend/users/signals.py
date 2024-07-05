from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from users.models import CustomUser

@receiver(post_save, sender=CustomUser)
def add_user_to_group(sender, instance, created, **kwargs):
    if created:
        try:
            customer_group = Group.objects.get(name='Customer')
        except:
            pass
        if not instance.is_superuser:
            instance.groups.add(customer_group)