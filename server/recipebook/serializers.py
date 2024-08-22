from rest_framework import serializers
from .models import RecipeBook, Recipe

class RecipeBookSerializer(serializers.ModelSerializer):

	# id = serializers.Field()

	class Meta:
		model = RecipeBook
		fields = ['id', 'title', 'description', 'recipes']