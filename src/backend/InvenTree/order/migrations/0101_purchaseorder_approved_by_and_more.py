# Generated by Django 4.2.11 on 2024-04-09 22:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('order', '0100_remove_returnorderattachment_order_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchaseorder',
            name='approved_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Approved by'),
        ),
        migrations.AddField(
            model_name='purchaseorder',
            name='approved_date',
            field=models.DateField(blank=True, help_text='Date order was approved', null=True, verbose_name='Approve Date'),
        ),
        migrations.AddField(
            model_name='purchaseorder',
            name='placed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='purchase_orders_placed', to=settings.AUTH_USER_MODEL, verbose_name='Placed by'),
        ),
        migrations.AddField(
            model_name='purchaseorder',
            name='reject_reason',
            field=models.CharField(blank=True, help_text='The reason for rejecting this order', max_length=250, verbose_name='Reason for rejection'),
        ),
        migrations.AlterField(
            model_name='purchaseorder',
            name='status',
            field=models.PositiveIntegerField(choices=[(10, 'Pending'), (20, 'Placed'), (30, 'Complete'), (40, 'Cancelled'), (50, 'Lost'), (60, 'Returned'), (70, 'Approval needed'), (80, 'Ready')], default=10, help_text='Purchase order status'),
        ),
    ]
