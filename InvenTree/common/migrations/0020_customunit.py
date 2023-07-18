# Generated by Django 3.2.20 on 2023-07-18 00:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0019_projectcode_metadata'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUnit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Unit name', max_length=50, unique=True, verbose_name='Name')),
                ('symbol', models.CharField(help_text='Unit symbol', max_length=10, unique=True, verbose_name='Symbol')),
                ('definition', models.CharField(help_text='Unit definition', max_length=50, verbose_name='Definition')),
            ],
        ),
    ]
