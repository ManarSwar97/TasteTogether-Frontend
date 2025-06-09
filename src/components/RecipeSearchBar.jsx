import { useState } from 'react'

const RecipeSearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState('')


  const handleSubmit = (event) => {
    event.preventDefault() //prevent page reload on form 
    onSearch(search) //onSearch handleSearch function from RecipeListAPI
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)} // update state on typing
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  )
}

export default RecipeSearchBar
