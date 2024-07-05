# Generated by Django 5.0.6 on 2024-07-05 15:01

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_rename_user_email_customuser_email_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="customuser",
            name="lastname",
        ),
        migrations.RemoveField(
            model_name="customuser",
            name="phone",
        ),
        migrations.RemoveField(
            model_name="customuser",
            name="role",
        ),
        migrations.RemoveField(
            model_name="customuser",
            name="surname",
        ),
        migrations.RemoveField(
            model_name="customuser",
            name="user_address",
        ),
        migrations.RemoveField(
            model_name="customuser",
            name="user_customer",
        ),
        migrations.RemoveField(
            model_name="customuser",
            name="user_image",
        ),
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("role", models.CharField(max_length=30)),
                ("phone", models.CharField(max_length=30)),
                ("surname", models.CharField(blank=True, max_length=50, null=True)),
                ("lastname", models.CharField(blank=True, max_length=50, null=True)),
                (
                    "user_customer",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                (
                    "user_address",
                    models.CharField(blank=True, max_length=50, null=True),
                ),
                ("user_image", models.CharField(blank=True, max_length=10, null=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "tbl_user_profiles",
            },
        ),
    ]
