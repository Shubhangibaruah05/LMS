# Generated by Django 3.2.16 on 2022-11-02 17:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0048_auto_20220913_0312'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='metadata',
            field=models.JSONField(blank=True, help_text='JSON metadata field, for use by external plugins', null=True, verbose_name='Plugin Metadata'),
        ),
    ]
