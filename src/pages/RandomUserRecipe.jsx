import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../stylesheet/randomUserRecipe.css'

const RandomUserRecipe = () => {
  const [recipes, setRecipes] = useState([])
  const [randomRecipe, setRandomRecipe] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const Recipes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/recipe/db', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.data || []) {
          setRecipes(response.data)
          if (response.data.length > 0) {
            RandomRecipe(response.data)
          }
        } else {
          setRecipes([])
          setRandomRecipe(null)
        }
      } catch (error) {
        setRecipes([])
        setRandomRecipe(null)
        setError('Failed to fetch recipes.')
      }
    }
    Recipes()
  }, [token])

  const RandomRecipe = (recipesList = recipes) => {
    if (recipesList.length === 0) {
      setRandomRecipe(null)
      return
    }
    const randomIndex = Math.floor(Math.random() * recipesList.length)
    setRandomRecipe(recipesList[randomIndex])
  }

  if (!token) {
    return (
      <div className="rur-not-signed-in">
        <h3>You must be signed in to view your recipes!</h3>
        <button onClick={() => navigate('/signin')} className="rur-btn-signin">
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="rur-container">
      <button onClick={() => RandomRecipe()} className="rur-btn-random-recipe">
        <img
          className="rur-icon"
          src="https://i.imgur.com/x68Mtvx.png"
          alt="Get Random User Recipe"
        />
        Show Another Random Recipe
      </button>

      {randomRecipe ? (
        <div className="rur-recipe-card rur-margin-top">
          {randomRecipe.user && (
            <div className="rur-user-info-wrapper">
              {randomRecipe.user.image && (
                <img
                  className="rur-user-image"
                  src={`http://localhost:3001/uploads/${randomRecipe.user.image}`}
                  alt={randomRecipe.user.username}
                />
              )}
              <div className="rur-recipe-content">
                <h3>{randomRecipe.user.username}</h3>
              </div>
            </div>
          )}

          <h2 className="rur-recipe-name">{randomRecipe.recipeName}</h2>
          <p className="rur-recipe-description">{randomRecipe.recipeDescription}</p>
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
              className="rur-recipe-image rur-max-width-300"
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
        className="rur-btn rur-margin-top"
      >
        Back to All Recipes
      </button>
    </div>
  )
}

export default RandomUserRecipe
