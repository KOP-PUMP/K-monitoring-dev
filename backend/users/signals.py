from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from users.models import CustomUser, UserProfile

@receiver(post_save, sender=CustomUser)
def add_user_to_group(sender, instance, created, **kwargs):
    if created:
        try:
            customer_group = Group.objects.get_or_create(name='Customer')
        except:
            pass
        if not instance.is_superuser:
            instance.groups.add(customer_group)

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=CustomUser)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        try:
            profile = UserProfile.objects.get(user=instance)
            profile.save()
        except:
            UserProfile.objects.create(user=instance)