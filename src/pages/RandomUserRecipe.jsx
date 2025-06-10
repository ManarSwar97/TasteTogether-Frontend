import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RandomUserRecipe = () => {
  //to store all user recipes
  const [recipes, setRecipes] = useState([])
  //to store the random recipe
  const [randomRecipe, setRandomRecipe] = useState(null)
  //to set the error
  const [error, setError] = useState('')
  const navigate = useNavigate()
  //define the token for authentication
  const token = localStorage.getItem('token')

  useEffect(() => {
    //fetch recipes 
    const Recipes = async () => {
      try {
        //axios call to get the recipes from the database
        const response = await axios.get('http://localhost:3001/recipe/db', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        //check if the response data exist 
        if (response.data || []) {
          setRecipes(response.data) //store recipes
          //if theres recipes then pick a random one
          if (response.data.length > 0) {
            RandomRecipe(response.data)
          }
        } else {
          //if no recipes found set recipes to empty array and the random to null
          setRecipes([])
          setRandomRecipe(null)
        }
      } catch (error) {
        //if it catch an error then again ^
        setRecipes([])
        setRandomRecipe(null)
        setError('Failed to fetch recipes.')
      }
    }
    Recipes() //call the recipe function 
  }, [token])


//function to pick a random recipe from the database recipes
  const RandomRecipe = (recipesList = recipes) => {
    //if there was no recipes then set it to null
    if (recipesList.length === 0) {
      setRandomRecipe(null)
      return
    }
    const randomIndex = Math.floor(Math.random() * recipesList.length)
    setRandomRecipe(recipesList[randomIndex])
  }

  //if the user not logged in
  if (!token) {
    return (
      <div>
        <h3>You must be signed in to view your recipes!</h3>
        <button onClick={() => navigate('/signin')}>Sign In</button>
      </div>
    )
  }

  return (
    <div className="random-user-recipe-container">
      <h1>Random User Recipe</h1>
      <button
        onClick={() => RandomRecipe()}
        className="btn btn-random-recipe"
      >
        Show Another Random Recipe
      </button>

      {randomRecipe ? (
        <div className="random-recipe-card margin-top">
          {/* User info */}
          {randomRecipe.user && (
            <div className="user-info margin-bottom">
              <h3>Recipe by: {randomRecipe.user.username}</h3>
              {randomRecipe.user.image && (
                <img
                  className="user-random-recipe-image"
                  src={`http://localhost:3001/uploads/${randomRecipe.user.image}`}
                  alt={randomRecipe.user.username}
                />
              )}
            </div>
          )}

          {/* Recipe details */}
          <h2>{randomRecipe.recipeName}</h2>
          <p>{randomRecipe.recipeDescription}</p>
          <p>
            <strong>Ingredients:</strong> {randomRecipe.recipeIngredient}
          </p>
          <p>
            <strong>Instructions:</strong> {randomRecipe.recipeInstruction}
          </p>
          <p>
            <strong>Category:</strong> {randomRecipe.recipeCategory}
          </p>
          {randomRecipe.recipeImage && (
            <img
              className="recipe-image max-width-300"
              src={`http://localhost:3001/uploads/${randomRecipe.recipeImage}`}
              alt={randomRecipe.recipeName}
            />
          )}
        </div>
      ) : (
        <p>No recipes available. Please add some first!</p>
      )}

      <button
        onClick={() => navigate('/user/recipes')}
        className="btn margin-top"
      >
        Back to All Recipes
      </button>
    </div>
  )
}

export default RandomUserRecipe
