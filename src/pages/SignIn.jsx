import { useState } from 'react'
import { SignInUser } from '../services/Auth'
import { useNavigate } from 'react-router-dom'

const SignIn = ({ setUser }) => {
  let navigate = useNavigate()
  const initialState = { username: '', password: '' }
  const [formValues, setFormValues] = useState(initialState)
  const [errors, setErrors] = useState({})
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const payload = await SignInUser(formValues)
    setFormValues(initialState)
    setUser(payload.user || payload)
    const userId = payload?.user?._id || payload?.id
    if (userId) {
      localStorage.setItem('userId', userId)
    }
    if (payload?.token) {
      localStorage.setItem('token', payload.token)
    }
    navigate('/main')
  } catch (error) {
    setErrors({
      general: error?.msg || 'Login failed. Please try again.'
    })
  }
}

  return (
    <div className="signin-container">
      <h1 className="signin-heading">Sign In</h1>
      <p className="signin-subtext">Sign in to continue </p>
      {errors.general && (
           <p className="error-message">{errors.general}</p>
        )}
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="username">Username</label>
          <input
            onChange={handleChange}
            id="username"
            type="text"
            value={formValues.username}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            id="password"
            value={formValues.password}
            required
          />
        </div>
        <button
          className="signin-button"
          disabled={!formValues.username || !formValues.password}
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
export default SignIn
