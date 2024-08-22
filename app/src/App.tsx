import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import { DiscoverRecipes } from './DiscoverRecipes'
import RecipeBooks from './RecipeBooks'
import RecipeBook from './RecipeBook'
import NewRecipeBook from './NewRecipeBook'

function Dashboard() {
	return (
		<div style={{
			height: '100vh',
			display: 'flex',
			flexDirection: 'column',
			padding: '5rem',
		}}>
			<h1>RecipeCollect</h1>
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				gap: '1rem',
				marginBottom: '1rem',
			}}>
				<a href="/recipes">Discover Recipes</a>
				<a href="/recipebook">Recipe Books</a>
			</div>
			<Outlet />
		</div>
	)
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Dashboard />}>
					<Route path="/recipes" element={<DiscoverRecipes />} />
					<Route path='/recipebook' element={<RecipeBooks />} />
					<Route path='/recipebook/new' element={<NewRecipeBook />} />
					<Route path='/recipebook/:id' element={<RecipeBook />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
