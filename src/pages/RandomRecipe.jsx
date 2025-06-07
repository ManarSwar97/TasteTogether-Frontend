import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const RandomRecipe = () => {
  const [randomRecipe, setRandomRecipe] = useState(null)
  const navigate = useNavigate()

  // random recipe function
  const handleRandomRecipe = async () => {
    try {
      const response = await axios.get('http://localhost:3001/recipe/random')
      const random = response.data.meals ? response.data.meals[0] : null
      setRandomRecipe(random)
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="random-recipe-container">
      <h1>Random Recipe</h1>

      {/* random recipe button */}
      <button onClick={handleRandomRecipe} className="random-button">
        Get Random Recipe
      </button>

      {/* Back button  */}
      <button onClick={() => navigate('/recipes')} className="back-button">
        Back to Recipes
      </button>


      {/* Display random recipe */}
      {randomRecipe && (
        <div className="random-recipe-card">
          <h2>{randomRecipe.strMeal}</h2>
          <p>{randomRecipe.strCategory}</p>
          <img
            src={randomRecipe.strMealThumb}
            alt={randomRecipe.strMeal}
            className="recipe-image"
          />
          <p>{randomRecipe.strInstructions}</p>
          <h4>Ingredients:</h4>
          <ul>
            {Object.keys(randomRecipe)
              .filter(
                (key) =>
                  key.startsWith('strIngredient') &&
                  randomRecipe[key] &&
                  randomRecipe[key].trim() !== ''
              )
              .map((key, index) => (
                <li key={index}>{randomRecipe[key]}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default RandomRecipe
