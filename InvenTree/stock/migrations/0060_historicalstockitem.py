# Generated by Django 3.2 on 2021-04-26 09:34

import InvenTree.fields
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import djmoney.models.fields
import markdownx.models
import mptt.fields
import simple_history.models


class Migration(migrations.Migration):

    dependencies = [
        ('part', '0064_auto_20210404_2016'),
        ('company', '0037_supplierpart_update_3'),
        ('order', '0044_auto_20210404_2016'),
        ('users', '0005_owner_model'),
        ('build', '0027_auto_20210404_2016'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('stock', '0059_auto_20210404_2016'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoricalStockItem',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('uid', models.CharField(blank=True, help_text='Unique identifier field', max_length=128)),
                ('packaging', models.CharField(blank=True, help_text='Packaging this stock item is stored in', max_length=50, null=True, verbose_name='Packaging')),
                ('serial', models.CharField(blank=True, help_text='Serial number for this item', max_length=100, null=True, verbose_name='Serial Number')),
                ('link', InvenTree.fields.InvenTreeURLField(blank=True, help_text='Link to external URL', max_length=125, verbose_name='External Link')),
                ('batch', models.CharField(blank=True, help_text='Batch code for this stock item', max_length=100, null=True, verbose_name='Batch Code')),
                ('quantity', models.DecimalField(decimal_places=5, default=1, max_digits=15, validators=[django.core.validators.MinValueValidator(0)], verbose_name='Stock Quantity')),
                ('updated', models.DateField(blank=True, editable=False, null=True)),
                ('is_building', models.BooleanField(default=False)),
                ('expiry_date', models.DateField(blank=True, help_text='Expiry date for stock item. Stock will be considered expired after this date', null=True, verbose_name='Expiry Date')),
                ('stocktake_date', models.DateField(blank=True, null=True)),
                ('review_needed', models.BooleanField(default=False)),
                ('delete_on_deplete', models.BooleanField(default=True, help_text='Delete this Stock Item when stock is depleted', verbose_name='Delete on deplete')),
                ('status', models.PositiveIntegerField(choices=[(10, 'OK'), (50, 'Attention needed'), (55, 'Damaged'), (60, 'Destroyed'), (70, 'Lost'), (65, 'Rejected'), (85, 'Returned')], default=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('notes', markdownx.models.MarkdownxField(blank=True, help_text='Stock Item Notes', null=True, verbose_name='Notes')),
                ('purchase_price_currency', djmoney.models.fields.CurrencyField(choices=[('AUD', 'Australian Dollar'), ('CAD', 'Canadian Dollar'), ('EUR', 'Euro'), ('NZD', 'New Zealand Dollar'), ('GBP', 'Pound Sterling'), ('USD', 'US Dollar'), ('JPY', 'Yen')], default='USD', editable=False, max_length=3)),
                ('purchase_price', djmoney.models.fields.MoneyField(blank=True, decimal_places=4, default_currency='USD', help_text='Single unit purchase price at time of purchase', max_digits=19, null=True, verbose_name='Purchase Price')),
                ('infinite', models.BooleanField(default=False)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('belongs_to', models.ForeignKey(blank=True, db_constraint=False, help_text='Is this item installed in another item?', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='stock.stockitem', verbose_name='Installed In')),
                ('build', models.ForeignKey(blank=True, db_constraint=False, help_text='Build for this stock item', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='build.build', verbose_name='Source Build')),
                ('customer', models.ForeignKey(blank=True, db_constraint=False, help_text='Customer', limit_choices_to={'is_customer': True}, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='company.company', verbose_name='Customer')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('location', mptt.fields.TreeForeignKey(blank=True, db_constraint=False, help_text='Where is this stock item located?', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='stock.stocklocation', verbose_name='Stock Location')),
                ('owner', models.ForeignKey(blank=True, db_constraint=False, help_text='Select Owner', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='users.owner', verbose_name='Owner')),
                ('parent', mptt.fields.TreeForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='stock.stockitem', verbose_name='Parent Stock Item')),
                ('part', models.ForeignKey(blank=True, db_constraint=False, help_text='Base part', limit_choices_to={'active': True, 'virtual': False}, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='part.part', verbose_name='Base Part')),
                ('purchase_order', models.ForeignKey(blank=True, db_constraint=False, help_text='Purchase order for this stock item', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='order.purchaseorder', verbose_name='Source Purchase Order')),
                ('sales_order', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='order.salesorder', verbose_name='Destination Sales Order')),
                ('stocktake_user', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('supplier_part', models.ForeignKey(blank=True, db_constraint=False, help_text='Select a matching supplier part for this stock item', null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='company.supplierpart', verbose_name='Supplier Part')),
            ],
            options={
                'verbose_name': 'historical stock item',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
