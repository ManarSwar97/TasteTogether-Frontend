import { useState, useEffect } from 'react'
import axios from 'axios'
import RecipeSearchBar from './RecipeSearchBar'
import { Link } from 'react-router-dom'
const RecipeListAPI = () => {
  const [recipes, setRecipes] = useState(null)
  const [error, setError] = useState(null)

  //to preview all the recipes in the page
  useEffect(() => {
    Recipes()
  }, [])

  //to get the recipes from the api
  const Recipes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/recipe')
      setRecipes(response.data)
    } catch (error) {
      setError('Failed to fetch recipes')
    }
  }

  //for the search recipe
  const handleSearch = async (search) => {
    if (!search.trim()) {
      Recipes()
      return
    }

    //the result of the search bar
    try {
      const response = await axios.get(
        `http://localhost:3001/recipe/search/${search}`
      )
      if (response.data.meals) {
        setRecipes(response.data.meals)
      } else {
        setRecipes([]) // No results
      }
    } catch (error) {
      setError('Failed to search recipes') //if theres an error
      setRecipes([])
    }
  }

  if (recipes === null) return <div>Loading recipes...</div>
  if (recipes.length === 0) return <div>No recipes found.</div>

  return (
    <div className="recipe-list-container">
      <h1 className="recipe-list-title">Recipes</h1>
      {error && <div className="error-message">{error}</div>}
      {/* show the error */}

      {/* the recipeSearchBar call */}
      <RecipeSearchBar onSearch={handleSearch} />

      {/* random recipe button */}
      <Link to="/random" className="random-button">
        Get Random Recipe
      </Link>

      {/* preview the recipes with the ingredients */}
      <div className="recipes-grid">
        {recipes.map((recipe) => {
          const ingredients = Object.keys(recipe)
            .filter(
              (key) => key.startsWith('strIngredient') && recipe[key]?.trim()
            )
            .map((key) => recipe[key].trim())

          return (
            <div className="recipe-card" key={recipe.idMeal}>
              <h2 className="recipe-name">{recipe.strMeal}</h2>
              <p className="recipe-category">{recipe.strCategory}</p>
              <img
                className="recipe-image"
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                loading="lazy"
              />
              <p className="recipe-instructions">{recipe.strInstructions}</p>
              <h4>Ingredients:</h4>
              <ul className="ingredients-list">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecipeListAPI
