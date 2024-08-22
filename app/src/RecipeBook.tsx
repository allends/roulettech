import { useNavigate, useParams } from 'react-router'
import { type RecipeBook, RecipeBookLoaded } from './RecipeBooks'
import { useCallback, useEffect, useState } from 'react'
import { Recipe } from './DiscoverRecipes'

export function RecipeCard(props: {
	recipe: Recipe
	recipeBook: RecipeBook
	refresh: () => void
}) {

	const removeRecipeFromRecipeBook = async () => {
		try {
			const result = await fetch(
				`http://localhost:8000/api/recipebook/remove_recipe`,
				{
					method: 'POST',
					body: JSON.stringify({
						recipe_id: props.recipe.id,
						recipe_book_id: props.recipeBook.pk,
					}),
				}
			)

			await result.json()

			props.refresh()
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
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '1rem',
					alignItems: 'center',
				}}
			>
				<h2>{props.recipe.title}</h2>
				<button onClick={removeRecipeFromRecipeBook}>
					Remove from Recipe Book
				</button>
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

export default function RecipeBook() {

	const navigate = useNavigate()
	const { id } = useParams()

	// fetch the recipebook data from the API
	const [recipeBook, setRecipeBook] = useState<RecipeBookLoaded | null>(null)
	const [refresh, setRefresh] = useState(false)

	const deleteRecipeBook = async () => {

		if (!id) {
			return
		}

		try {
			const result = await fetch(
				`http://localhost:8000/api/recipebook/delete`,
				{
					method: 'POST',
					body: JSON.stringify({
						id: parseInt(id),
					}),
				}
			)

			await result.json()
			navigate('/recipebook')
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetch(`http://localhost:8000/api/recipebook?id=${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setRecipeBook(data)
			})
	}, [id, refresh])

	const refreshRecipeBook = useCallback(() => {
		setRefresh(!refresh)
	}, [refresh])

	if (!recipeBook) {
		return <div>Loading...</div>
	}

	return (
		<div>
			<a href="/recipebook">back to all</a>
			<h1>{recipeBook.fields.title}</h1>
			<p>{recipeBook.fields.description}</p>
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
			}}>
				<h2>Recipes</h2>
				<button onClick={deleteRecipeBook}>Delete Book</button>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
				}}
			>
				{recipeBook.recipes.map((recipe) => (
					<RecipeCard
						key={recipe.id}
						recipe={recipe}
						recipeBook={recipeBook}
						refresh={refreshRecipeBook}
					/>
				))}
			</div>
		</div>
	)
}
