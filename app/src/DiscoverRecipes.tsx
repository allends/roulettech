import { useState, useEffect, useCallback } from 'react'
import { RecipeBook, useRecipeBooks } from './RecipeBooks'

export type Recipe = {
	title: string
	summary: string
	id: number
	image_url: string
}

export function RecipeCard(props: { recipe: Recipe; recipeBooks?: RecipeBook[] }) {

	const addRecipeToRecipeBook = async (recipeBookId: number, recipeId: number) => {
		try {
			const result = await fetch(
				`http://45.79.128.201:8000/api/recipebook/add_recipe`,
				{
					method: 'POST',
					body: JSON.stringify({
						recipe_book_id: recipeBookId,
						recipe_id: recipeId,
					}),
				}
			)

			const response = await result.json()

			return response.data
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div
			key={props.recipe.id}
			style={{
				border: '1px solid black',
				padding: '1rem 2rem',
				borderRadius: '10px',
			}}
		>
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				gap: '1rem',
				alignItems: 'center',
			}}>
				<h2>{props.recipe.title}</h2>
				{
					props.recipeBooks && (
						<select value={"Add to Recipe Book"} onChange={(value) => {
							addRecipeToRecipeBook(parseInt(value.target.value), props.recipe.id)
						}}>
							<option value="Add to Recipe Book">Add to Recipe Book</option>
							{props.recipeBooks.map((recipeBook) => (
								<option value={recipeBook.pk}>{recipeBook.fields.title}</option>
							))}
						</select>

					)
				}
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '1rem',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<p
					dangerouslySetInnerHTML={{ __html: props.recipe.summary }}
					style={{
						textAlign: 'left',
					}}
				></p>
				<img
					src={props.recipe.image_url}
					alt={props.recipe.title}
					style={{
						width: '200px',
						height: '200px',
						objectFit: 'cover',
						borderRadius: '10px',
					}}
				/>
			</div>
		</div>
	)
}

export const useRecipes = () => {
	const [recipes, setRecipes] = useState<Recipe[]>([])

	const fetchRecipes = useCallback(async () => {
		try {
			const result = await fetch(
				'http://45.79.128.201:8000/api/recipe/list',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json; charset=utf-8',
					},
				}
			)

			const response = await result.json()

			return response.data
		} catch (error) {
			console.error(error)
		}
	}, [])

	useEffect(() => {
		let abort = false

		if (recipes.length > 0) {
			return
		}
		fetchRecipes().then((recipes) => {
			if (!abort && !!recipes) {
				setRecipes(recipes)
			}
		})

		return () => {
			abort = true
		}
	}, [fetchRecipes, recipes])

	return {
		recipes,
		fetchRecipes,
	}
}

export function DiscoverRecipes() {
	const recipeBooks = useRecipeBooks()
	const { recipes } = useRecipes()

	console.log(recipes)

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				padding: '1rem',
			}}
		>
			<h2>Discover Recipes</h2>
			{recipes.length === 0 && <p>Loading recipes...</p>}
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					overflowY: 'scroll',
					gap: '1rem',
				}}
			>
				{recipes.map((recipe: Recipe) => (
					<RecipeCard
						recipe={recipe}
						key={recipe.id}
						recipeBooks={recipeBooks}
					/>
				))}
			</div>
		</div>
	)
}
