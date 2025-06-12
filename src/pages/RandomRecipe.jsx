import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../stylesheet/randomRecipe.css'
const RandomRecipe = () => {
  const [randomRecipe, setRandomRecipe] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  //for the recipe youtube video
  const getYoutubeId = (url) => {
    try {
      if (!url) return null //return null if no URL exist
      const videoUrl = new URL(url) //parse URL to string and gives an object
      return videoUrl.searchParams.get('v') //search for the query parameter which is here v
    } catch {
      return null
    }
  }

  // random recipe function
  const handleRandomRecipe = async () => {
    try {
      //axios call to get random recipe
      const response = await axios.get('http://localhost:3001/recipe/random')
      //check if the response.data.meals (array of recipes) exist then take it from the array otherwise set the random as null
      const random = response.data.meals ? response.data.meals[0] : null
      setRandomRecipe(random) //set the Random Recipe
    } catch (error) {
      setError('No recipe found. Please try again!')
    }
  }

  return (
    <div className="random-recipe-container">

      {/* random recipe button */}
      <button onClick={handleRandomRecipe} className="random-button">
        <img
          className="icon"
          src="https://i.imgur.com/zv7HkoO.png"
          alt="Get Random Recipe"
        />
        Get Random Recipe
      </button>

      {/* Back button */}
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

          {/* Embed YouTube video if available */}
          {getYoutubeId(randomRecipe.strYoutube) && (
            <div className="video-container">
              <h4>Watch the Recipe Video:</h4>
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${getYoutubeId(
                  randomRecipe.strYoutube
                )}`}
                title="Recipe Video"
                allow="autoplay; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RandomRecipe
