# Generated by Django 3.2.23 on 2023-12-18 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0108_auto_20240219_0252'),
    ]

    operations = [
        migrations.AddField(
            model_name='stockitemtestresult',
            name='finished_datetime',
            field=models.DateTimeField(blank=True, help_text='The timestamp of the test finish', verbose_name='Finished'),
        ),
        migrations.AddField(
            model_name='stockitemtestresult',
            name='started_datetime',
            field=models.DateTimeField(blank=True, help_text='The timestamp of the test start', verbose_name='Started'),
        ),
        migrations.AddField(
            model_name='stockitemtestresult',
            name='test_station',
            field=models.CharField(blank=True, help_text='The identifier of the test station where the test was performed', max_length=500, verbose_name='Test station'),
        ),
    ]
