# Generated by Django 5.1 on 2024-08-21 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipebook', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='id',
            field=models.CharField(auto_created=True, max_length=100, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='recipebook',
            name='id',
            field=models.CharField(auto_created=True, max_length=100, primary_key=True, serialize=False),
        ),
    ]
