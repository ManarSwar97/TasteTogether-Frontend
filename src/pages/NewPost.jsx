import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
const NewPost = ({ addPost }) =>{
    let navigate = useNavigate()
    const initialState = {
        postImage: '',
        postDescription: '',
    }
    const [postState, setPostState] = useState(initialState)
        const handleChange = (event) => {
        const { id, value, files } = event.target
        setPostState({
            ...postState,
            [id]: files ? files[0] : value
        })
        }

const handleSubmit = async (event) => {
  event.preventDefault()
  const formData = new FormData()
  formData.append('postImage', postState.postImage)
  formData.append('postDescription', postState.postDescription)

  const token = localStorage.getItem('token')

  const response = await axios.post('http://localhost:3001/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
  const newPost = response.data
  addPost(newPost)
  setPostState(initialState)
  navigate('/main')

  }
    return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="postImage">Post Image:</label>
      <input
        id="postImage"
        type="file"
        onChange={handleChange}
      />
      <label htmlFor="postDescription">Post Description:</label>
      <input
        id="postDescription"
        type="text"
        onChange={handleChange}
        value={postState.postDescription}
      />
      <button type="submit">Create Post</button>
    </form>
  )
}

export default NewPost