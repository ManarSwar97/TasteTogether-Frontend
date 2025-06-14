import { useState, useEffect } from "react"
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"
const UpdatePost = ({ addPost }) =>{
    const initialState = {
        postImage: '',
        postDescription: '',
    }
    const [postState, setPostState] = useState(initialState)
    let navigate = useNavigate()
    const { post_id } = useParams()


    useEffect(()=>{
      const getPost = async() =>{
        const response = await axios.get(`http://localhost:3001/posts/${post_id}`)
        setPostState({
          postImage: '',
          postDescription: response.data.postDescription
        })
      }
      getPost()
    }, [post_id])

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
    if (postState.postImage) {
      formData.append('postImage', postState.postImage)
    }
      formData.append('postDescription', postState.postDescription)

    const token = localStorage.getItem('token')

    const response = await axios.put(`http://localhost:3001/posts/${post_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })
      const newPost = response.data
      addPost(newPost)
      console.log(newPost)
      setPostState(initialState)
      navigate('/main')

  }
return (
  <form onSubmit={handleSubmit} className="new-post-form">
    <label htmlFor="postImage" className="form-label">Post Image:</label>

    <label htmlFor="postImage" className="custom-file-upload">
      Choose Image
    </label>
    <input
      id="postImage"
      type="file"
      onChange={handleChange}
      className="file-input"
    />

    <label htmlFor="postDescription" className="form-label">Post Description:</label>
    <input
      id="postDescription"
      type="text"
      onChange={handleChange}
      value={postState.postDescription}
      className="form-input"
    />

    <button type="submit" className="form-button">Update Post</button>
  </form>
)

}

export default UpdatePost