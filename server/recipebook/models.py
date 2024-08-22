from django.db import models

# Create your models here.

class Recipe(models.Model):
	id = models.CharField(max_length=100, primary_key=True, auto_created=False)
	title = models.CharField(max_length=100)
	summary = models.TextField()
	image_url = models.CharField(max_length=100)

class RecipeBook(models.Model):
	title = models.CharField(max_length=100)
	description = models.TextField()
	recipes = models.ManyToManyField(Recipe)