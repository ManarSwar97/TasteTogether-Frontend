import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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

const NewRecipe = ({ addRecipe }) => {
  let navigate = useNavigate()

  //the initial state for the recipe form
  const initialState = {
    recipeName: '',
    recipeDescription: '',
    recipeInstruction: '',
    recipeIngredient: '',
    recipeCategory: '',
    recipeImage: ''
  }
  const [recipeState, setRecipeState] = useState(initialState) //set the form

  //handle the changes in the form fields
  const handleChange = (event) => {
    const { id, value, files } = event.target
    setRecipeState({
      ...recipeState,
      [id]: files ? files[0] : value
    })
  }

  //handle the form submission by taking the data added
  const handleSubmit = async (event) => {
    //to prevent the lagging in the reload and to not delete the data that existed already after reload
    event.preventDefault()
    const formData = new FormData()
    formData.append('recipeName', recipeState.recipeName)
    formData.append('recipeImage', recipeState.recipeImage)
    formData.append('recipeDescription', recipeState.recipeDescription)
    formData.append('recipeInstruction', recipeState.recipeInstruction)
    formData.append('recipeIngredient', recipeState.recipeIngredient)
    formData.append('recipeCategory', recipeState.recipeCategory)

    //to define the token from the local storage for authentication 
    const token = localStorage.getItem('token')

    //the axios call for the response to add the recipes in the database
    const response = await axios.post(
      'http://localhost:3001/recipe/db',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    )

    //save the new recipe
    const newRecipe = response.data
    addRecipe(newRecipe)
    setRecipeState(initialState) //set the form to initial state after saving and submit
    navigate('/user/recipes') //navigate to the user recipe page
  }

  return (
    <form onSubmit={handleSubmit} className="new-recipe-form">
      <h2>Add Recipe</h2>
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
        {/* the categories list as select and options */}
        <option value="" disabled>
          Select category
        </option>
        {categoriesList.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input type="file" id="recipeImage" onChange={handleChange} required />
      <button type="submit">Create Recipe</button>
    </form>
  )
}

export default NewRecipe
