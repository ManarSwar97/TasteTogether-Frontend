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
      //trim to remove any spaces
      Recipes()
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
  //show loading or not found
  if (recipes === null) return <div>Loading recipes...</div>
  if (recipes.length === 0) return <div>No recipes found.</div>

  return (
    <div className="recipe-list-container">
      <h1 className="recipe-list-title">Recipes</h1>
      {/* the recipeSearchBar call */}
      <RecipeSearchBar onSearch={handleSearch} />

      {/* random recipe button */}
      <Link to="/random" className="random-button">
        Get Random Recipe
      </Link>

      {/* preview the recipes with the ingredients */}
      <div className="recipes-grid">
        {recipes.map((recipe) => {
          // make a list of ingredients from the recipe object
          // the recipe object has keys like strIngredient1, strIngredient2, ...
          // some might be empty or null, so filter them but before use Object.keys to make an array of the object fields

          const ingredients = Object.keys(recipe)
            .filter(
              //its works with array and return a new array thats why i used Object.keys

              //recipe[key] to access the value of the given key

              (key) =>
                key.startsWith(
                  //startsWith is a method that return true or false

                  //recipe[key] to access the value of the given key '?.' chaining operator to check if it not undefined or null before trim(), if its not it will return undefined
                  'strIngredient'
                ) && recipe[key]?.trim()
            )
            .map((key) => recipe[key].trim())

          return (
            <Link
              to={`/recipe/${recipe.idMeal}`}
              className="recipe-card"
              key={recipe.idMeal}
            >
              <h2 className="recipe-name">{recipe.strMeal}</h2>
              <p className="recipe-category">{recipe.strCategory}</p>
              <img
                className="recipe-image"
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
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
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default RecipeListAPI
