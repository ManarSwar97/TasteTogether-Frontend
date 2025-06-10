import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'


const UserRecipe = ({ user, recipes, setRecipes }) => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token') // get token from localStorage for authentication

  // to fetch recipes from backend with auth token
  const Recipes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/recipe/db', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecipes(response.data || []) //set recipes to response data or empty array if theres no data
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setRecipes([]) // clear recipes 
    }
  }

  useEffect(() => {
    if (!user) {
      setRecipes([]) // clear recipes if no user
      return
    }
    Recipes() // fetch recipes when user changes
  }, [user, setRecipes, token])

  // navigate to add new recipe page
  const handleAddRecipe = () => {
    navigate('/recipes/new')
  }

  // delete a recipe by id, then update recipes state to remove it
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/recipe/db/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecipes(recipes.filter((recipe) => recipe._id !== id)) //remove the recipe with the matching id from the list
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  if (!user) {
    // show message if user is not signed in
    return (
      <div className="protected-message">
        <h3 className="protected-title">
          Oops! You must be signed in to see your recipes!
        </h3>
        <button className="btn btn-signin" onClick={() => navigate('/signin')}>
          Sign In
        </button>
      </div>
    )
  }

  const currentUserId = localStorage.getItem('userId') // get current user id from the local storage

  return (
    <div className="user-recipes-container">
      <h1 className="page-title">Users Recipes</h1>
      <button className="btn btn-add-recipe" onClick={handleAddRecipe}>
        Add Recipe
      </button>
      <button
        className="btn btn-random-recipe"
        onClick={() => navigate('/recipes/random')}
      >
        Show Random Recipe
      </button>

      <div className="recipe-list">
        {recipes.length === 0 ? (
          <p className="no-recipes-msg">No recipes found. Try adding some!</p>
        ) : (
          <div className="grid grid-cols-4">
            {recipes.map((recipe) => (
              <div className="recipe-card" key={recipe._id }>
                <div className="recipe-user-info">
                  {recipe.user?.image && (
                    <img
                      className="user-recipe-profile-image"
                      src={`http://localhost:3001/uploads/${recipe.user.image}`}
                      alt={`${recipe.user.username}'s profile`}
                    />
                  )}
                  <span className="username-user-recipe">
                    {recipe.user?.username || 'Unknown User'}
                  </span>
                </div>
                <h3 className="recipe-name">{recipe.recipeName}</h3>
                <p className="recipe-description">{recipe.recipeDescription}</p>
                <p className="recipe-ingredients">
                  <strong>Ingredients:</strong> {recipe.recipeIngredient}
                </p>
                <p className="recipe-instructions">
                  <strong>Instructions:</strong> {recipe.recipeInstruction}
                </p>
                <p className="recipe-category">
                  <strong>Category:</strong> {recipe.recipeCategory}
                </p>
                {recipe.recipeImage && (
                  <img
                    className="recipe-image"
                    src={`http://localhost:3001/uploads/${recipe.recipeImage}`}
                    alt={recipe.recipeName}
                  />
                )}

                {/* show edit/delete buttons only if current user owns this recipe */}
                {recipe.user?.toString() === currentUserId && (
                  <div className="card-buttons">
                    <Link className="edit-link" to={`/update/${recipe._id}`}>
                      <button className="btn btn-edit">Edit Recipe</button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(recipe._id)}
                    >
                      Delete Recipe
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserRecipe
