from django.http import Http404, HttpResponse
from django.core import serializers
import requests
import json

from .lib import add_recipe_to_recipebook_by_id, create_recipe_from_id, get_recipebook_by_id, get_recipe_by_id, list_recipes
from .models import RecipeBook, Recipe

# Create your views here.
def get_random_recipes(request):
	print("hello world")
	return HttpResponse(list_recipes())

def get_all_recipebooks(request):
	query_set = RecipeBook.objects.all()
	data = serializers.serialize("json", query_set)
	return HttpResponse(data)

def create_recipebook(request):

	if request.method != "POST":
		return HttpResponse("This endpoint only accepts POST requests")

	# Get the title and description from the request
	body = json.loads(request.body.decode("utf-8"))
	title = body.get("title")
	description = body.get("description")

	# Create a new RecipeBook object
	recipe_book = RecipeBook(title=title, description=description)

	# Save the RecipeBook object to the database
	recipe_book.save()

	print("id: ", recipe_book.id)

	# Return the new RecipeBook object as JSON
	data = serializers.serialize("json", [recipe_book])

	return HttpResponse(data)

def add_recipe_to_recipebook(request):

	if request.method != "POST":
		return HttpResponse("This endpoint only accepts POST requests")

	# Get the recipe book id and recipe id from the request
	body = json.loads(request.body.decode("utf-8"))
	recipe_book_id = body.get("recipe_book_id")
	recipe_id = body.get("recipe_id")

	# Add the recipe to the recipe book
	add_recipe_to_recipebook_by_id(recipe_book_id, recipe_id)

	# Return a success message

	return HttpResponse(json.dumps({"message": "Recipe added to recipe book"}), status=200)

def create_recipe(request):

	if request.method != "POST":
		return HttpResponse("This endpoint only accepts POST requests")

	# Get the title and description from the request
	body = json.loads(request.body.decode("utf-8"))
	title = body.get("title")
	summary = body.get("summary")
	id = body.get("id")

	# Create a new Recipe object
	recipe = Recipe(id=id, title=title, summary=summary)

	# Save the Recipe object to the database
	recipe.save()

	# Return the new Recipe object as JSON
	data = serializers.serialize("json", [recipe])

	return HttpResponse(data)

def get_recipe(request):

	print("request: ", request.GET)

	recipe_id = request.GET.get("id")

	if recipe_id is None:
		return HttpResponse("Please provide a recipe id")

	try:
		recipe = get_recipe_by_id(recipe_id)
	except:
		recipe = create_recipe_from_id(recipe_id)

	data = serializers.serialize("json", [recipe])

	return HttpResponse(data)

def get_recipebook(request):

	recipebook_id = request.GET.get("id")

	if recipebook_id is None:
		return HttpResponse("Please provide a recipebook id", status=400)

	recipebook = get_recipebook_by_id(recipebook_id)

	recipes = recipebook.recipes.iterator()

	loaded_recipes = []
	for recipe in recipes:
		loadedRecipe = get_recipe_by_id(recipe.id)
		loaded_recipes.append({
			"title": loadedRecipe.title,
			"summary": loadedRecipe.summary,
			"image_url": loadedRecipe.image_url,
			"id": loadedRecipe.id
		})

	# Create a JSON object from the serialized recipebook data
	data = serializers.serialize("json", [recipebook])

	json_data = json.loads(data)[0]

	# Add the recipes to the JSON object
	json_data["recipes"] = loaded_recipes

	# Convert the JSON object back to a string
	data = json.dumps(json_data)

	return HttpResponse(data)

def remove_recipe_from_recipebook(request):

	if request.method != "POST":
		return HttpResponse("This endpoint only accepts POST requests")

	# Get the recipe book id and recipe id from the request
	body = json.loads(request.body.decode("utf-8"))
	recipe_book_id = body.get("recipe_book_id")
	recipe_id = body.get("recipe_id")

	# Get the recipe book
	recipe_book = get_recipebook_by_id(recipe_book_id)

	# Get the recipe
	recipe = get_recipe_by_id(recipe_id)

	# Remove the recipe from the recipe book
	recipe_book.recipes.remove(recipe)

	# Save the recipe book
	recipe_book.save()

	# Return a success message
	return HttpResponse(json.dumps({"message": "Recipe removed from recipe book"}), status=200)

def delete_recipe_book(request):

	if request.method != "POST":
		return HttpResponse("This endpoint only accepts POST requests")

	# Get the recipe book id from the request
	body = json.loads(request.body.decode("utf-8"))
	recipe_book_id = body.get("id")

	# Get the recipe book
	recipe_book = get_recipebook_by_id(recipe_book_id)

	# Delete the recipe book
	recipe_book.delete()

	# Return a success message
	return HttpResponse(json.dumps({"message": "Recipe book deleted"}), status=200)