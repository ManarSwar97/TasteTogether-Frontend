import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
const Post = ({post}) => {
const [isDeleted, setIsDeleted] = useState(false)
let navigate = useNavigate()
const handleDelete = async () => {
  const token = localStorage.getItem('token')
  try {
    await axios.delete(`http://localhost:3001/posts/${post._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setIsDeleted(true)
    navigate('/main')
  } catch (error) {
    console.error("Error deleting post:", error)
  }
}

return (
  <div className="post-card">
    <img src={`http://localhost:3001/uploads/${post.postImage}`} alt="Post" />
    <p style={{ color: 'black' }}>{post.postDescription}</p>
    
    <Link to={`/update/${post._id}`}>
      <button>Edit Post</button>
    </Link>

    <Link to={`/delete/${post._id}`}>
      <button onClick={handleDelete}>Delete Post</button>
    </Link>

  </div>
)
}
export default Post
