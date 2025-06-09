import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

//category list same as the one in the api
const categoriesList = [
  'Beef',
  'Chicken',
  'Dessert',
  'Lamb',
  'Miscellaneous',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
  'Breakfast',
  'Goat'
]

const UpdateRecipe = ({ addRecipe }) => {
  const navigate = useNavigate()
  const { recipe_id } = useParams() //get the recipe id from URL parameters

  //the initial state of the form fields 
  const initialState = {
    recipeName: '',
    recipeDescription: '',
    recipeInstruction: '',
    recipeIngredient: '',
    recipeCategory: '',
    recipeImage: null //in case the user uploads a new image 
  }

  //to hold the current recipe loaded from the database
  const [recipeState, setRecipeState] = useState(initialState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //fetch the recipe from the database
    const Recipe = async () => {
      try {
        //axios call to get the recipe in the database by id
        const response = await axios.get(
          `http://localhost:3001/recipe/db/${recipe_id}`
        )
        const recipe = response.data //return the full recipe

        //populate the form field with the existing recipe data
        setRecipeState({
          recipeName: recipe.recipeName || '',
          recipeDescription: recipe.recipeDescription || '',
          recipeInstruction: recipe.recipeInstruction || '',
          recipeIngredient: recipe.recipeIngredient || '',
          recipeCategory: recipe.recipeCategory || '',
          recipeImage: null // No existing image file, user can upload new
        })
        setLoading(false) // finish the loading 
      } catch (error) {
        console.error('Failed to fetch recipe:', error)
        setLoading(false)
      }
    }
    Recipe() //call the recipe function for the fetch recipes from the database
  }, [recipe_id])

  if (loading) return <p>Loading recipe data...</p>

  //handle the changes in any form field 
  const handleChange = (event) => {
    const { id, value, files } = event.target
    setRecipeState({
      ...recipeState,
      [id]: files ? files[0] : value
    })
  }

  //handle the form submission to send the updated recipe data
  const handleSubmit = async (event) => {
    //prevent reloading the page 
    event.preventDefault()

    //using formData to send multipart form data
    const formData = new FormData()

    //append the recipe fields from state to the form data
    formData.append('recipeName', recipeState.recipeName)
    formData.append('recipeDescription', recipeState.recipeDescription)
    formData.append('recipeInstruction', recipeState.recipeInstruction)
    formData.append('recipeIngredient', recipeState.recipeIngredient)
    formData.append('recipeCategory', recipeState.recipeCategory)

  //append the image file if the user uploads a new one
    if (recipeState.recipeImage) {
      formData.append('recipeImage', recipeState.recipeImage)
    }

    //define token for authentication 
    const token = localStorage.getItem('token')

    try {
      //axios call to PUT the new updated recipe fields by id
      const response = await axios.put(
        `http://localhost:3001/recipe/db/${recipe_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      //save the response data in the updatedRecipe 
      const updatedRecipe = response.data
      //add the updated response ( recipe fields) to the recipes
      addRecipe(updatedRecipe)
      //set the recipe state to initial state
      setRecipeState(initialState)
      //navigate to user recipes page
      navigate('/user/recipes')
    } catch (error) {
      console.error('Failed to update recipe:', error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="new-recipe-form"
      encType="multipart/form-data"
    >
      <h2>Update Recipe</h2>

      <input
        type="text"
        id="recipeName"
        value={recipeState.recipeName}
        onChange={handleChange}
        placeholder="Recipe Name"
        required
      />

      <textarea
        id="recipeDescription"
        value={recipeState.recipeDescription}
        onChange={handleChange}
        placeholder="Description"
        required
      />

      <textarea
        id="recipeInstruction"
        value={recipeState.recipeInstruction}
        onChange={handleChange}
        placeholder="Instructions"
        required
      />

      <textarea
        id="recipeIngredient"
        value={recipeState.recipeIngredient}
        onChange={handleChange}
        placeholder="Ingredients"
        required
      />

      <select
        id="recipeCategory"
        value={recipeState.recipeCategory}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Select category
        </option>
        {categoriesList.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <input
        type="file"
        id="recipeImage"
        onChange={handleChange}
      />

      <button type="submit">Update Recipe</button>
    </form>
  )
}

export default UpdateRecipe
