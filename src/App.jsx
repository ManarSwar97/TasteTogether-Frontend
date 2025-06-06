import { useState, useEffect } from 'react'
import { Route, Routes , useNavigate} from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import './App.css'
import SignIn from './pages/SignIn'
import MainHome from './pages/MainHome'
import NewPost from './pages/NewPost'
import UpdatePost from './pages/UpdatePost'
import Sidebar from './components/SideBar'
import RoomSidebar from './components/RoomSidebar'
import { CheckSession } from './services/Auth'

const App = () => {
    const [user, setUser] = useState(null)

    const [posts, setPosts] = useState([])


    const navigate = useNavigate()

  useEffect(() => {
    const token= localStorage.getItem('token')
    if(token){
      checkToken()
    }
  }, [])

  const handleLogOut = () => {
    //Reset all auth related state and clear localStorage
    setUser(null)
    localStorage.removeItem('token') 
    navigate('/signin');
  }

  //to not logout when the user reload the page its just like session
const checkToken = async () => {
  try {
    const user = await CheckSession()
    if (user) {
      setUser(user)
    } else {
      handleLogOut()
    }
  } catch (error) {
    console.error('Session check failed:', error)
    handleLogOut()
  }
}
  const addPost = (newPost) => {
    setPosts(prev => [...prev, newPost])
  }


  return (
    <>
<Sidebar handleLogOut={handleLogOut} user={user} />
      <main>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn setUser={setUser}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<MainHome user={user} posts={posts} />} />
          <Route path="/new" element={<NewPost addPost={addPost} />} />
          <Route path="/update/:post_id" element={<UpdatePost addPost={addPost}/>} />

        </Routes>
      </main>
    <RoomSidebar />

    </>
  )
}

export default App
