# Generated manually to add pump_image (upload of a real photo per pump)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pump_data', '0021_rename_brand_pumpdetail_address_en_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='pumpdetail',
            name='pump_image',
            field=models.ImageField(blank=True, null=True, upload_to='pump_images/'),
        ),
    ]
