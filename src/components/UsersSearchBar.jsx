import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../stylesheet/UserSearchBar.css'

const UsersSearchBar = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    const Users = async () => {
      try {
        //axios call to get all the users
        const response = await axios.get('http://localhost:3001/users')
        //set the users from the response
        setUsers(response.data)
        //to hide all the users
        setFilteredUsers([])
      } catch (error) {
        throw error
      }
    }
    Users()
  }, [])

  //to handle input  changes in the searchbar
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    //if the input empty clear the filtered list
    if (value.trim() === '') {
      setFilteredUsers([])
    } else {
      //else filter the users whose username included in the search
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(value.toLowerCase())
      )
      //set the filtered users with the filtered list
      setFilteredUsers(filtered)
    }
  }

  return (
    <div className="search-users-container">
      <input
        type="text"
        placeholder="Search for user..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-users-input"
      />

      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li key={user._id} className="user-item">
            <Link to={`/profile/${user._id}`} className="user-link">
              {user.image && (
                <img
                  src={`http://localhost:3001/uploads/${user.image}`}
                  alt={user.username}
                  className="user-image"
                />
              )}
              <span className="username">{user.username}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersSearchBar
