import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import UsersSearchBar from '../components/UsersSearchBar'
import '../stylesheet/usersList.css'

const UsersList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const Users = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users')
        setUsers(response.data)
      } catch (error) {
        console.error('Error loading users', error)
      }
    }
    Users()
  }, [])

  return (
    <div className="ul-container">
      {/* Wrapper for search bar + button and title */}
      <div className="ul-search-bar-wrapper">
        <div className="ul-search-bar">
          <UsersSearchBar />
          <div className="ul-random-btn">
            <Link to="/profile/randomProfile">
              <button className="ul-btn-random">
                <img
                  className="ul-icon"
                  src="https://cdn-icons-png.flaticon.com/128/7527/7527325.png"
                  alt="show-random-profile"
                />
              </button>
            </Link>
          </div>
        </div>
        <h2 className="ul-title">Users Page</h2>
      </div>

      {/* Users Grid */}
      <div className="ul-cards-grid">
        {users.map((user) => (
          <Link
            key={user._id}
            to={`/profile/${user._id}`}
            className="ul-user-card"
          >
            <img
              src={
                user.image
                  ? `http://localhost:3001/uploads/${user.image}`
                  : '/default-profile.png'
              }
              alt={`${user.username} profile`}
              className="ul-user-image"
            />
            <h3 className="ul-username">{user.username}</h3>
            <p className="ul-fullname">
              {user.firstName} {user.lastName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UsersList
