# Generated by Django 5.1 on 2024-08-21 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipebook', '0006_alter_recipebook_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='image_url',
            field=models.CharField(default='https://img.spoonacular.com/recipes/636411-556x370.jpg', max_length=100),
            preserve_default=False,
        ),
    ]
