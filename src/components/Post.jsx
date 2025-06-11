import { FaEllipsisV, FaEdit, FaTrash,FaHeart, FaRegHeart, FaComment} from 'react-icons/fa'
import { Link } from "react-router-dom"
import { useState } from "react"
import axios from 'axios'
import Comment from "./Comment"

const Post = ({ post }) => {
  const currentUserId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  const [isDeleted, setIsDeleted] = useState(false)
  const [liked, setLiked] = useState(post.likes.includes(currentUserId))
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const [menuOpen, setMenuOpen] = useState(false)
  const [foodEmojis, setFoodEmojis] = useState([]);
  const [showComments, setShowComments] = useState(false)


  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsDeleted(true) 
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const totalLikes = parseInt(response.data, 10)
      setLikeCount(totalLikes)
      setLiked(true)
      const emojis = ['💕','🍕'];
      setFoodEmojis(emojis);
      setTimeout(() => setFoodEmojis([]), 1000);
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }
  if (isDeleted) return null

  return (
    <div className="post-card">
      <div className='post-user-info'>
        <img src={`http://localhost:3001/uploads/${post.user.image}`} alt="user profile" />
        <p>{post.user.username}</p>
      </div>
      <img src={`http://localhost:3001/uploads/${post.postImage}`}/>
    <div className="like-comment-buttons">
          <button onClick={handleLike} disabled={liked} className="like-button">
            <span className="like-content">
              {liked ? <FaHeart color="red" size={24} /> : <FaRegHeart color="gray" size={24} />}
              <span className="like-count">{likeCount}</span>
            </span>
          </button>
          <button onClick={() => setShowComments(prev => !prev)} className="comment-button">
            <FaComment color="gray" size={24} style={{ marginLeft: '-20px' }} />
        </button>

          {foodEmojis.map((emoji, index) => (
            <span
              key={index}
              className="food-anim"
              style={{
                position: 'absolute',
                left: `${30 + index * 20}px`,
                top: '-50px',
                fontSize: '24px',
                pointerEvents: 'none'
              }}>
              {emoji}
            </span>
          ))}
    </div>
      <p>{post.postDescription}</p>
    {showComments && <Comment postId={post._id} />}
    {post.user && String(post.user._id) === String(currentUserId) && (
        <div className="kebab-menu">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaEllipsisV />
          </button>

          {menuOpen && (
            <div className="kebab-second-div">
              <Link
                to={`/updatePost/${post._id}`}
                onClick={() => setMenuOpen(false)}
                className="kebab-option"
              >
                <FaEdit /> Edit
              </Link>

              <button
                onClick={() => {
                  handleDelete()
                  setMenuOpen(false)
                }}
                className="delete-post"
                style={{color: '#806D58'}}
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
      )}    
    </div>
  )
}

export default Post
