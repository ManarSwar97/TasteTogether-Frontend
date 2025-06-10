import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditProfile = () => {
  //get the user id from URL param
  const { user_id } = useParams()
  const navigate = useNavigate()
  //token for authentication
  const token = localStorage.getItem('token')

  //store the form data in state
  const [formValues, setFormValues] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    typeOfFood: '',
    image: null
  })

  useEffect(() => {
    const User = async () => {
      try {
        //axios call to get the user data using user id
        const response = await axios.get(
          `http://localhost:3001/users/${user_id}`
        )
        //save the response in "user"
        const user = response.data.user
        //fill the form with the existing user data
        setFormValues({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          typeOfFood: user.typeOfFood,
          image: null
        })
      } catch (error) {
        throw error
      }
    }
    //call the function to get the user data
    User()
  }, [user_id])

  //to update the changes in form values
  const handleChange = (e) => {
    const { id, type, files, value } = e.target
    if (type === 'file') {
      setFormValues({ ...formValues, [id]: files[0] })
    } else {
      setFormValues({ ...formValues, [id]: value })
    }
  }

  //handle the submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('username', formValues.username)
    formData.append('firstName', formValues.firstName)
    formData.append('lastName', formValues.lastName)
    formData.append('email', formValues.email)
    formData.append('typeOfFood', formValues.typeOfFood)
    //if an image uploaded, add it
    if (formValues.image) {
      formData.append('profileImage', formValues.image)
    }

    try {
      //axios call to update the user profile
      await axios.put(`http://localhost:3001/users/${user_id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      //after updating, go to the user profile page
      navigate(`/profile/${user_id}`)
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        {/* First Name */}
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            value={formValues.firstName}
            onChange={handleChange}
          />
        </div>
        {/* Last Name */}
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            value={formValues.lastName}
            onChange={handleChange}
          />
        </div>
        {/* Email */}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
          />
        </div>
        {/* Type of Food */}
        <div>
          <label htmlFor="typeOfFood">Type of Food:</label>
          <input
            id="typeOfFood"
            type="text"
            value={formValues.typeOfFood}
            onChange={handleChange}
          />
        </div>
        {/* Profile Image */}
        <div>
          <label htmlFor="image">Profile Image:</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  )
}

export default EditProfile
