from django.urls import path
from . import views

urlpatterns = [
	path('recipe', views.get_recipe),
	path('recipe/list', views.get_random_recipes),
	path('recipe/create', views.create_recipe),
	path('recipebook', views.get_recipebook),
	path('recipebook/list', views.get_all_recipebooks),
	path('recipebook/create', views.create_recipebook),
	path('recipebook/add_recipe', views.add_recipe_to_recipebook),
	path('recipebook/remove_recipe', views.remove_recipe_from_recipebook),
	path('recipebook/delete', views.delete_recipe_book),
]