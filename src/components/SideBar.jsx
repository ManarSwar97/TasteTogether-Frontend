import { Link, useNavigate } from 'react-router-dom'
import '../stylesheet/sidebar.css'

const Sidebar = ({ handleLogOut, user }) => {
  if (!user) return null

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
        <Link to="/main">
          <img
            className="icon"
            src="https://cdn-icons-png.flaticon.com/128/2550/2550430.png"
            alt="Home"
          />
        </Link>
        <Link to="/restaurants">
          <img
            className="icon"
            src="https://cdn-icons-png.flaticon.com/128/1689/1689246.png"
            alt="restaurants"
          />
        </Link>
        <Link to="/recipes">
          <img
            className="icon"
            src="https://cdn-icons-png.flaticon.com/128/1721/1721455.png"
            alt="Recipes"
          />
        </Link>
        <Link to="/user/recipes">
          <img
            className="icon"
            src="https://i.imgur.com/OYSgL7F.png"
            alt="Users-Recipes"
          />
        </Link>
        <Link to="/users">
          <img
            className="icon"
            src="https://i.imgur.com/VNDml7E.png"
            alt="All-Users"
          />
        </Link>
      </div>

      <div className="sidebar-bottom">
        {user && <button onClick={logout}>Sign Out</button>}
      </div>
    </div>
  )
}

export default Sidebar
