# Generated by Django 3.0.7 on 2020-11-17 03:53

from django.db import migrations
import djmoney.models.fields
import common.currency


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0054_remove_stockitem_build_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stockitem',
            name='purchase_price',
            field=djmoney.models.fields.MoneyField(blank=True, decimal_places=4, default_currency=common.currency.currency_code_default(), help_text='Single unit purchase price at time of purchase', max_digits=19, null=True, verbose_name='Purchase Price'),
        ),
    ]
