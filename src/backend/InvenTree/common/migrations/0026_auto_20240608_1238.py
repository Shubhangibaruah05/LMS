# Generated by Django 4.2.12 on 2024-06-08 12:38

from django.db import migrations
from django.core.files.storage import default_storage


def update_attachments(apps, schema_editor):
    """Migrate any existing attachment models to the new attachment table."""

    Attachment = apps.get_model('common', 'attachment')

    # Legacy attachment types to convert:
    # app_label, table name, target model, model ref
    legacy_models = [
        ('build', 'BuildOrderAttachment', 'build', 'build'),
        ('company', 'CompanyAttachment', 'company', 'company'),
        ('company', 'ManufacturerPartAttachment', 'manufacturerpart', 'manufacturer_part'),
        ('order', 'PurchaseOrderAttachment', 'purchaseorder', 'order'),
        ('order', 'SalesOrderAttachment', 'salesorder', 'order'),
        ('order', 'ReturnOrderAttachment', 'order', 'order'),
        ('part', 'PartAttachment', 'part', 'part'),
        ('stock', 'StockItemAttachment', 'stockitem', 'stock_item')
    ]

    N = 0

    for app, model, target_model, model_ref in legacy_models:
        LegacyAttachmentModel = apps.get_model(app, model)

        if LegacyAttachmentModel.objects.count() == 0:
            continue

        to_create = []

        for attachment in LegacyAttachmentModel.objects.all():

            # Find the size of the file (if exists)
            if attachment.attachment and default_storage.exists(attachment.attachment.name):
                try:
                    file_size = default_storage.size(attachment.attachment.name)
                except NotImplementedError:
                    file_size = 0
            else:
                file_size = 0

            to_create.append(
                Attachment(
                    model_type=target_model,
                    model_id=getattr(attachment, model_ref).pk,
                    attachment=attachment.attachment,
                    link=attachment.link,
                    comment=attachment.comment,
                    upload_date=attachment.upload_date,
                    upload_user=attachment.user,
                    file_size=file_size
                )
            )

        if len(to_create) > 0:
            print(f"Migrating {len(to_create)} attachments for the legacy '{model}' model.")
            Attachment.objects.bulk_create(to_create)

        N += to_create
    
    # Check the correct number of Attachment objects has been created
    assert(N == Attachment.objects.count())


def delete_attachments(apps, schema_editor):
    """Reverse data migration removes any Attachment objects."""

    Attachment = apps.get_model('common', 'attachment')

    if n := Attachment.objects.count():
        Attachment.objects.all().delete()
        print(f"Deleted {n} Attachments in reverse migration")


class Migration(migrations.Migration):

    dependencies = [
        ('build', '0050_auto_20240508_0138'),
        ('common', '0025_attachment'),
        ('company', '0069_company_active'),
        ('order', '0099_alter_salesorder_status'),
        ('part', '0123_parttesttemplate_choices'),
        ('stock', '0110_alter_stockitemtestresult_finished_datetime_and_more')
    ]

    operations = [
        migrations.RunPython(update_attachments, reverse_code=delete_attachments)
    ]
