# Generated by Django 3.2.18 on 2023-04-19 02:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0017_notesimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(help_text='Unique project code', max_length=50, unique=True, verbose_name='Project Code')),
                ('description', models.CharField(blank=True, help_text='Project description', max_length=200, verbose_name='Description')),
            ],
        ),
    ]
