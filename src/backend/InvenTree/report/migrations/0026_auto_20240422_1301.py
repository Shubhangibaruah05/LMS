# Generated by Django 4.2.11 on 2024-04-22 13:01

import os

from django.db import connection, migrations
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


def label_model_map():
    """Map legacy label template models to model_type values."""

    return {
        "stockitemlabel": "stockitem",
        "stocklocationlabel": "stocklocation",
        "partlabel": "part",
        "buildlinelabel": "buildline",
    }


def convert_legacy_labels(table_name, model_name, template_model):
    """Map labels from an existing table to a new model type
    
    Arguments:
        table_name: The name of the existing table
        model_name: The name of the new model type
        template_model: The model class for the new template model
    
    Note: We use raw SQL queries here, as the original 'label' app has been removed entirely.
    """
    count = 0

    fields = [
        'name', 'description', 'label', 'enabled', 'height', 'width', 'filename_pattern', 'filters'
    ]

    fieldnames = ', '.join(fields)

    query = f"SELECT {fieldnames} FROM {table_name};"

    with connection.cursor() as cursor:
        try:
            cursor.execute(query)
        except Exception:
            # Table likely does not exist
            print(f"Legacy label table {table_name} not found - skipping migration")
            return 0

        rows = cursor.fetchall()

    for row in rows:
        data = {
            fields[idx]: row[idx] for idx in range(len(fields))
        }

        # Skip any "builtin" labels
        if 'label/inventree/' in data['label']:
            continue

        print(f"Creating new LabelTemplate for {model_name} - {data['name']}")

        if template_model.objects.filter(name=data['name'], model_type=model_name).exists():
            print(f"LabelTemplate {data['name']} already exists for {model_name} - skipping")
            continue


        if not default_storage.exists(data['label']):
            print(f"Label template file {data['label']} does not exist - skipping")
            continue

        # Create a new template file object
        filedata = default_storage.open(data['label']).read()
        filename = os.path.basename(data['label'])

        # Remove the 'label' key from the data dictionary
        data.pop('label')

        data['template'] = ContentFile(filedata, filename)
        data['model_type'] = model_name

        template_model.objects.create(**data)

        count += 1

    return count


def forward(apps, schema_editor):
    """Run forwards migrations.
    
    - Create a new LabelTemplate instance for each existing legacy label template.
    """

    LabelTemplate = apps.get_model('report', 'labeltemplate')

    count = 0

    for template_class, model_type in label_model_map().items():

        table_name = f'label_{template_class}'

        count += convert_legacy_labels(table_name, model_type, LabelTemplate) or 0

    if count > 0:
        print(f"Migrated {count} report templates to new LabelTemplate model.")

def reverse(apps, schema_editor):
    """Run reverse migrations.
    
    - Delete any LabelTemplate instances in the database
    """

    LabelTemplate = apps.get_model('report', 'labeltemplate')

    n = LabelTemplate.objects.count()

    if n > 0:
        for item in LabelTemplate.objects.all():

            item.template.delete()
            item.delete()

        print(f"Deleted {n} LabelTemplate objects and templates")

class Migration(migrations.Migration):

    atomic = False

    dependencies = [
        ('report', '0025_labeltemplate'),
    ]

    operations = [
        migrations.RunPython(forward, reverse_code=reverse)
    ]

