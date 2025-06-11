import { useState } from 'react'
import { RegisterUser } from '../services/Auth'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  let navigate = useNavigate()
  const initialState = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: '',
    typeOfFood: ''
  }

  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (e) => {
    const { id, type, files, value } = e.target
    if (type === 'file') {
      setFormValues({ ...formValues, [id]: files[0] })
    } else {
      setFormValues({ ...formValues, [id]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('username', formValues.username)
    formData.append('firstName', formValues.firstName)
    formData.append('lastName', formValues.lastName)
    formData.append('email', formValues.email)
    formData.append('password', formValues.password)
    formData.append('typeOfFood', formValues.typeOfFood)

    if (formValues.image) {
      formData.append('profileImage', formValues.image) // key matches multer middleware
    }

    await RegisterUser(formData) // Your RegisterUser function must support sending FormData
    setFormValues(initialState)
    navigate('/signin')
  }

  return (
    <div className="register-container">
      <h2 className="register-heading">Create New Account</h2>
      <p className="register-login-link">
        already registered? <Link to="/signin">Sign In</Link>{' '}
      </p>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* USERNAME */}
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
        {/* FIRST NAME */}
        <div className="input-wrapper">
          <label htmlFor="firstName">First Name</label>
          <input
            onChange={handleChange}
            id="firstName"
            type="text"
            value={formValues.firstName}
            required
          />
        </div>
        {/* LAST NAME */}
        <div className="input-wrapper">
          <label htmlFor="lastName">Last Name</label>
          <input
            onChange={handleChange}
            id="lastName"
            type="text"
            value={formValues.lastName}
            required
          />
        </div>
        {/* EMAIL */}
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            id="email"
            type="email"
            placeholder="example@example.com"
            value={formValues.email}
            required
          />
        </div>
        {/* PASSWORD */}
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

        {/* CONFIRM PASSWORD */}
        <div className="input-wrapper">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            onChange={handleChange}
            type="password"
            id="confirmPassword"
            value={formValues.confirmPassword}
            required
          />
        </div>

        {/* IMAGE */}
        <div className="input-wrapper">
          <label htmlFor="image">Profile Image</label>
          <input
            onChange={handleChange}
            id="image"
            type="file"
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="typeOfFood">Favorite Type of Food</label>
          <input
            onChange={handleChange}
            id="typeOfFood"
            type="text"
            value={formValues.typeOfFood}
          />
        </div>

        <button
          className="register-button"
          disabled={
            !formValues.email ||
            (!formValues.password &&
              formValues.password === formValues.confirmPassword)
          }
        >
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
