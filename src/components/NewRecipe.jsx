import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../stylesheet/addRecipe.css'
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

  const initialState = {
    recipeName: '',
    recipeDescription: '',
    recipeInstruction: '',
    recipeIngredient: '',
    recipeCategory: '',
    recipeImage: ''
  }
  const [recipeState, setRecipeState] = useState(initialState)

  const handleChange = (event) => {
    const { id, value, files } = event.target
    setRecipeState({
      ...recipeState,
      [id]: files ? files[0] : value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('recipeName', recipeState.recipeName)
    formData.append('recipeImage', recipeState.recipeImage)
    formData.append('recipeDescription', recipeState.recipeDescription)
    formData.append('recipeInstruction', recipeState.recipeInstruction)
    formData.append('recipeIngredient', recipeState.recipeIngredient)
    formData.append('recipeCategory', recipeState.recipeCategory)

    const token = localStorage.getItem('token')

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

    const newRecipe = response.data
    addRecipe(newRecipe)
    setRecipeState(initialState)
    navigate('/user/recipes')
  }

  return (
    <form onSubmit={handleSubmit} className="nr-form">
      <h2 className="nr-title">Add Recipe</h2>
      <input
        type="text"
        id="recipeName"
        value={recipeState.recipeName}
        onChange={handleChange}
        placeholder="Recipe Name"
        required
        className="nr-input"
      />
      <textarea
        id="recipeDescription"
        value={recipeState.recipeDescription}
        onChange={handleChange}
        placeholder="Description"
        required
        className="nr-textarea"
      />
      <textarea
        id="recipeInstruction"
        value={recipeState.recipeInstruction}
        onChange={handleChange}
        placeholder="Instructions"
        required
        className="nr-textarea"
      />
      <textarea
        id="recipeIngredient"
        value={recipeState.recipeIngredient}
        onChange={handleChange}
        placeholder="Ingredients"
        required
        className="nr-textarea"
      />
      <select
        id="recipeCategory"
        value={recipeState.recipeCategory}
        onChange={handleChange}
        required
        className="nr-select"
      >
        <option value="" disabled>
          Select category
        </option>
        {categoriesList.map((category) => (
          <option key={category} value={category} className="nr-option">
            {category}
          </option>
        ))}
      </select>
      <input
        type="file"
        id="recipeImage"
        onChange={handleChange}
        required
        className="nr-file-input"
      />
      <button type="submit" className="nr-submit-btn">
        Create Recipe
      </button>
    </form>
  )
}

export default NewRecipe
