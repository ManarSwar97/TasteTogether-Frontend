import { useState } from 'react'
import { SignInUser } from '../services/Auth'
import { useNavigate } from 'react-router-dom'
const SignIn = ({ setUser }) => {
  let navigate = useNavigate()
  const initialState = { email: '', password: '' }
  const [formValues, setFormValues] = useState(initialState)
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = await SignInUser(formValues)
    setFormValues(initialState)
    setUser(payload)
    navigate('/main')
  }
  return (
    <div className="col signin">
      <form className="col" onSubmit={handleSubmit}>
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
        <button disabled={!formValues.username || !formValues.password}>
          Sign In
        </button>
      </form>
    </div>
  )
}
export default SignIn