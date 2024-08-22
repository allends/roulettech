from django.contrib import admin

# Register your models here.

from .models import Recipe, RecipeBook

class RecipeAdmin(admin.ModelAdmin):

	fieldsets = [
		(None, {'fields': ['title']}),
		('Summary', {'fields': ['summary']}),
	]

	list_display = ('id', 'title', 'summary')

admin.site.register(Recipe, RecipeAdmin)
