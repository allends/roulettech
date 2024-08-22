import json
import requests
import os
from .models import RecipeBook, Recipe
from django.core import serializers
from django.http import HttpResponse, Http404

API_KEY = os.environ.get('API_KEY')

APPLICATION_ID = os.environ.get('APPLICATION_ID')
APPLICATION_KEY = os.environ.get('APPLICATION_KEY')

def get_recipebook_by_id(recipebook_id):
	try:
		query_set = RecipeBook.objects.filter(pk=recipebook_id)
	except RecipeBook.DoesNotExist:
		raise Http404("RecipeBook does not exist")

	if len(query_set) == 0:
		raise Http404("RecipeBook does not exist")

	return query_set[0]

def get_recipe_by_id(recipe_id):
	try:
		query_set = Recipe.objects.filter(pk=recipe_id)
	except Recipe.DoesNotExist:
		raise Http404("Recipe does not exist")

	if len(query_set) == 0:
		raise Http404("Recipe does not exist")

	return query_set[0]

def list_recipes():
	url = "https://api.edamam.com/api/recipes/v2"
	response = requests.get(url, params={"type": 'public', "app_id": APPLICATION_ID, "app_key": APPLICATION_KEY, "random" : 'true', "diet": 'balanced'})

	# Get the response as JSON
	responseJson = response.json()

	hits = responseJson.get("hits")

	# Map hits to be the shape we want
	mappedHits = []
	for hit in hits:
		mappedHits.append({
			"title": hit.get("recipe").get("label"),
			"summary": "<br /> ".join(hit.get("recipe").get("ingredientLines")),
			"image_url": hit.get("recipe").get("image"),
			"id": hit.get("recipe").get("uri").split("_")[-1]
		})

	formattedJson = {}

	formattedJson['data'] = mappedHits

	# Return the hits field
	return json.dumps(formattedJson)

def create_recipe_from_id(recipe_id):
	url = "https://api.edamam.com/api/recipes/v2/{id}".format(id=recipe_id)

	response = requests.get(url, params={ "type": 'public', "app_id": APPLICATION_ID, "app_key": APPLICATION_KEY })

	json = response.json()

	things = {
		"labels": json.get("recipe").get("label"),
		"ingredientLines": ", ".join(json.get("recipe").get("ingredientLines")),
		"image": json.get("recipe").get("image")
	}

	print(things)

	recipe = Recipe(
		title=json.get("recipe").get("label"),
		summary="<br /> ".join(json.get("recipe").get("ingredientLines")),
		id=recipe_id,
		image_url=json.get("recipe").get("image")
	)

	recipe.save()

	return recipe

def get_or_create_recipe_from_id(recipe_id):
	try:
		recipe = get_recipe_by_id(recipe_id)
	except Http404:
		recipe = create_recipe_from_id(recipe_id)

	return recipe

def add_recipe_to_recipebook_by_id(recipe_book_id, recipe_id):
	recipe_book = get_recipebook_by_id(recipe_book_id)
	print("recipe_book: ", recipe_book)
	recipe = get_or_create_recipe_from_id(recipe_id)
	print("recipe: ", recipe)

	recipe_book.recipes.add(recipe)
	recipe_book.save()

	return recipe_book