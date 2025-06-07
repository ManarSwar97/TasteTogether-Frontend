import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

const RecipeDetails = () => {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const Recipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipe/${id}`)
        if (response.data.meals && response.data.meals.length > 0) {
          setRecipe(response.data.meals[0])
        } else {
          setError('Recipe not found.')
        }
      } catch (error) {
        setError('Failed to fetch recipe.')
      }
    }

    Recipe()
  }, [id])

  if (error) return <div>{error}</div>
  if (!recipe) return <div>Loading recipe...</div>

  const ingredients = Object.keys(recipe)
    .filter((key) => key.startsWith('strIngredient') && recipe[key]?.trim())
    .map((key) => recipe[key].trim())

   // Extract YouTube video ID from full URL
  const getYoutubeId = (url) => {
    if (!url) return null
    const videoUrl = new URL(url)
    return videoUrl.searchParams.get('v')
  }

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
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div> )}
    </div>
  )
}
export default RecipeDetails
