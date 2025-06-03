import { useState } from 'react'
import { RegisterUser } from '../services/Auth'

const Register = () => {
  const initialState = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image:'',
    typeOfFood:''
  }

  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    //its prevent to reload the default or initial again.
    e.preventDefault()
    console.log(formValues)
    await RegisterUser({
      username: formValues.username,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      image: formValues.image,
      typeOfFood: formValues.typeOfFood
    })
    setFormValues(initialState)
    navigate('/signIn')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            type="text"
            value={formValues.image}
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
