import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Recipe } from './DiscoverRecipes'

type RecipeBookFields = {
	title: string
	description: string
	recipes: string[]
}

export type RecipeBook = {
	model: 'recipebook.recipebook'
	pk: number
	fields: RecipeBookFields
}

export type RecipeBookLoaded = {
	model: 'recipebook.recipebook'
	pk: number
	fields: RecipeBookFields
	recipes: Recipe[]
}

function RecipeBookCard(props: { recipeBook: RecipeBook }) {
	const navigate = useNavigate()

	return (
		<div
			style={{
				border: '1px solid black',
				padding: '1rem 2rem',
				borderRadius: '10px',
				cursor: 'pointer',
			}}
			onClick={() => {
				navigate(`/recipebook/${props.recipeBook.pk}`)
			}}
		>
			<h2>{props.recipeBook.fields.title}</h2>
			<p>{props.recipeBook.fields.description}</p>
			<div>{props.recipeBook.fields.recipes.length} recipes</div>
		</div>
	)
}

export const useRecipeBooks = () => {
	const [recipeBooks, setRecipeBooks] = useState<RecipeBook[]>([])

	useEffect(() => {
		fetch('http://45.79.128.201:8000/api/recipebook/list', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		})
			.then((res) => res.text())
			.then((res) => {
				const recipeBooks = JSON.parse(res) as RecipeBook[]
				setRecipeBooks(recipeBooks)
			})
	}, [])

	return recipeBooks
}

export default function RecipeBooks() {
	const navigate = useNavigate()
	const recipeBooks = useRecipeBooks()

	return (
		<div
			style={{
				padding: '1rem',
			}}
		>
			<h2 style={{ textAlign: 'left' }}>Recipe Books</h2>
			<button
				style={{
					marginBottom: '1rem',
					padding: '0.5rem',
					border: '1px solid black',
					borderRadius: '5px',
				}}
				onClick={() => {
					navigate('/recipebook/new')
				}}
			>
				new recipe book
			</button>
			<div
				style={{
					display: 'grid',
					gap: '1rem',
					gridTemplateColumns: '1fr 1fr 1fr',
				}}
			>
				{recipeBooks.map((recipeBook) => {
					return (
						<RecipeBookCard
							recipeBook={recipeBook}
							key={recipeBook.pk}
						/>
					)
				})}
			</div>
		</div>
	)
}
