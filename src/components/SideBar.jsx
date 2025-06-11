import { Link, useNavigate } from 'react-router-dom'

const Sidebar = ({ handleLogOut, user }) => {
  const navigate = useNavigate()

  const goToProfile = () => {
    //check if the user exist and have id
    if (user && (user._id || user.id)) {
      const userId = user._id || user.id
      //navigate to user profile page
      navigate(`/profile/${userId}`)
    }
  }

  const logout = () => {
    handleLogOut()
    navigate('/signin')
  }

  return (
    <div className="sidebar">
      {user && (
        <div className="sidebar-user" onClick={goToProfile}>
          {user.image ? (
            <img
              src={`http://localhost:3001/uploads/${user.image}`}
              alt={`${user.username}'s profile`}
              className="sidebar-user-image"
            />
          ) : (
            <div className="sidebar-user-placeholder">
              {user.username?.[0]?.toUpperCase() || 'User'}
            </div>
          )}
        </div>
      )}
      <div className="sidebar-links">
        <Link to="/main">Home</Link>
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/user/recipes">Users Recipes</Link>
        <Link to="/users">All Users</Link>
      </div>

      <div className="sidebar-bottom">
        {user && <button onClick={logout}>Sign Out</button>}
      </div>
    </div>
  )
}

export default Sidebar
