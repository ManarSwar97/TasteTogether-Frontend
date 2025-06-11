import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import RandomProfile from './RandomProfile'
const UsersList = () => {
  //to set the user state
  const [users, setUsers] = useState([])

  useEffect(() => {
    const Users = async () => {
      try {
        //axios call to get all the users from the database
        const response = await axios.get('http://localhost:3001/users')
        setUsers(response.data) //seth the users
      } catch (error) {
        console.error('Error loading users', error)
      }
    }
    Users()
  }, [])

  return (
    <div className="users-list-container">
      <div className='random-profile-button'>
        <Link to="/profile/randomProfile">
        <button>Show Random Profiles</button>
        </Link>
      </div>
      <h2>All Users</h2>
      <div className="users-cards-grid">
        {users.map((user) => (
          <Link
            key={user._id}
            to={`/profile/${user._id}`}
            className="user-card"
          >
            <img
              src={
                user.image
                  ? `http://localhost:3001/uploads/${user.image}`
                  : '/default-profile.png'
              }
              alt={`${user.username} profile`}
              className="user-profile-image"
            />
            <h3>{user.username}</h3>
            <p>{user.firstName} {user.lastName}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UsersList
