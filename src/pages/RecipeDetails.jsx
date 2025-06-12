import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import '../stylesheet/RecipeDetails.css'
const RecipeDetails = () => {
  //extract the id from the url
  const { id } = useParams()
  //store the recipe data
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState(null)

  // to fetch recipe details when it mounts or id changes
  useEffect(() => {
    //fetch recipe by id
    const Recipe = async () => {
      try {
        //axios call to get the recipe by id
        const response = await axios.get(`http://localhost:3001/recipe/${id}`)

        //check if data exists and contain at least one meal
        if (response.data.meals && response.data.meals.length > 0) {
          setRecipe(response.data.meals[0]) //set the recipe
        } else {
          setError('Recipe not found.') //if its not found set the error
        }
      } catch (error) {
        setError('Failed to fetch recipe.') //if its not found set the error
      }
    }
    Recipe() //call the recipe function that fetch the recipe
  }, [id])

  if (!recipe) return <div>Loading recipe...</div>

  const ingredients = Object.keys(recipe)
    .filter((key) => key.startsWith('strIngredient') && recipe[key]?.trim())
    .map((key) => recipe[key].trim())

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
  //get the youtube video id from the recipe link
  const videoId = getYoutubeId(recipe.strYoutube)

  return (
    <div className="recipe-detail-container">
      <h1>{recipe.strMeal}</h1>
      <p>Category: {recipe.strCategory}</p>
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="recipe-image"
      />
      <p>{recipe.strInstructions}</p>
      <h4>Ingredients:</h4>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      {/* Embed YouTube video if available */}
      {videoId && (
        <div className="video-container">
          <h4>Watch the Recipe Video:</h4>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Recipe Video"
            allow="autoplay; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  )
}
export default RecipeDetails
