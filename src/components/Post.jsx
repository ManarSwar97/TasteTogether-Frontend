import { Link } from "react-router-dom"
const Post = ({ post }) => {
  return (
    <div className="post-card">
      <img src={`http://localhost:3001/uploads/${post.postImage}`} alt="Post" />
      <p style={{ color: 'black' }}>{post.postDescription}</p>
      <Link to="/update">
      <button>Edit Post</button>
      </Link>
      <Link to="/delete">
      <button>Delete Post</button>
      </Link>
    </div>
  )
}

export default Post
