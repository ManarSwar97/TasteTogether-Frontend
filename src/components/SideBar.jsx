import { Link , useNavigate } from 'react-router-dom'


const Sidebar = ({ handleLogOut , user }) => {
  const navigate = useNavigate();
  const logout = () => {
    handleLogOut()
    navigate('/signin'); // or '/' or any public route
  }
  return (
    <div className="sidebar">
      <div className="sidebar-links">
        <Link to="/">Home</Link>
        <Link to="/restaurants">Restaurants</Link>
        <Link to="/recipes">Recipes</Link>
      </div>
      <div className="sidebar-bottom">
        {user && (
          <button onClick={logout}>Sign Out</button>
        )}
      </div>
    </div>
  )
}


export default Sidebar
