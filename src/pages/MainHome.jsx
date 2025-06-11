import { Link } from "react-router-dom"
import Post from "../components/Post"
import { useState, useEffect } from "react"
import axios from 'axios'
import UsersSearchBar from "../components/UsersSearchBar"

const MainHome = ({user}) => {
  const [newPosts, setNewPosts] = useState([])
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/posts")
        setNewPosts(response.data)
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }

    fetchPosts()
  }, [])
  

  return (
    <div className="main-home">
          {/* Users Search Bar */}
      <div className="users-search-bar">
        <UsersSearchBar />
      </div>
      <div className="add-post">
        <Link to="/new">
        <button>Add a New Post</button>
        </Link>
        <h2>Posts</h2>
        {newPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default MainHome
