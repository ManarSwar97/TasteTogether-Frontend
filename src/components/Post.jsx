import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import Comment from "./Comment"
const Post = ({post}) => {
const currentUserId = localStorage.getItem('userId');
const [isDeleted, setIsDeleted] = useState(false)
const [liked, setLiked] = useState(post.likes.includes(currentUserId));
const [likeCount, setLikeCount] = useState(post.likes.length);
let navigate = useNavigate()

const handleDelete = async () => {
  try {
    const token = localStorage.getItem('token')
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

const handleLike = async () => {
  try {
    const token = localStorage.getItem('token')
    console.log("Liking post id:", post._id);
    console.log("Token:", token);
    console.log("current user id ", currentUserId)
    const response = await axios.post(
      `http://localhost:3001/posts/${post._id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const totalLikes = parseInt(response.data, 10);
    setLikeCount(totalLikes);
    setLiked(true); 
  } catch (error) {
    console.error("Error liking post:", error);
  }
};


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
    <button onClick={handleLike} disabled={liked}>
      {liked ? 'Liked' : 'Like'} ({likeCount})
    </button>
    <Comment postId={post._id}/>
  </div>
)
}
export default Post
