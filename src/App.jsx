import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import './App.css'
import SignIn from './pages/SignIn'

const App = () => {
    const [user, setUser] = useState(null)

  useEffect(() => {
    const token= localStorage.getItem('token')
    if(token){
      checkToken()
    }
  }, [])

  const handleLogOut = () => {
    //Reset all auth related state and clear localStorage
    setUser(null)
    localStorage.clear()
  }

  //to not logout when the user reload the page its just like session
  const checkToken = async () => {
    const user = await CheckSession()
    setUser(user)
  }
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn setUser={setUser}/>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  )
}

export default App
