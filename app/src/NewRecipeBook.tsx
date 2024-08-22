import { useState } from "react"
import { useNavigate } from "react-router"

export default function NewRecipeBook() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')

	const navigate = useNavigate()

	return (
		<div>
			<h1>New Recipe Book</h1>
			<form
				style={{
					margin: '0 auto',
					display: 'grid',
					gap: '1rem',
					gridTemplateColumns: '1fr 1fr',
				}}
				onSubmit={(e) => {
					e.preventDefault()

					if (!title || !description) {
						alert('Please fill out all fields')
						return
					}

					fetch('http://45.79.128.201:5173/api/recipebook/create', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
						},
						body: JSON.stringify({
							title,
							description,
						}),
					})
						.then((res) => res.json())
						.then((res) => {
							const id = res[0].pk
							navigate(`/recipebook/${id}`)
						})
				}}
			>
				<label htmlFor="title">Title</label>
				<input
					type="text"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<label htmlFor="description">Description</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<button style={{
					gridColumn: '1 / -1',
					padding: '0.5rem',
					border: '1px solid black',
					borderRadius: '5px',
				}} type="submit">Create</button>
			</form>
		</div>
	)
}