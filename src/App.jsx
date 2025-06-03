import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import './App.css'
import SignIn from './pages/SignIn'
import MainHome from './pages/MainHome'
import NewPost from './pages/NewPost'
import { CheckSession } from './services/Auth'

const App = () => {
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])


  useEffect(() => {
    const token= localStorage.getItem('token')
    if(token){
      checkToken()
    }
  }, [])

  const handleLogOut = () => {
    //Reset all auth related state and clear localStorage
    setUser(null)
    localStorage.removeItem('token')  }

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
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn setUser={setUser}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<MainHome user={user} posts={posts} />} />
          <Route path="/new" element={<NewPost addPost={addPost} />} />
        </Routes>
      </main>
    </>
  )
}

export default App
