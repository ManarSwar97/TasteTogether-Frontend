import { Link } from "react-router-dom"
import Post from "../components/Post"
import { useState, useEffect } from "react"
import axios from 'axios'
import UsersSearchBar from "../components/UsersSearchBar"

import { useNavigate } from "react-router-dom"
const MainHome = ({user}) => {
  const [newPosts, setNewPosts] = useState([])
  let navigate = useNavigate()
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
  if (!user) {
    // show message if user is not signed in
    return (
      <div className="protected-message">
        <h3 className="protected-title">
          Oops! You must be signed in to see your posts!
        </h3>
        <button className="btn btn-signin" onClick={() => navigate('/signin')}>
          Sign In
        </button>
      </div>
    )
  }  

    return (
        <div className="main-home">
          <div className="top-bar">
            <div className="users-search-bar">
              <UsersSearchBar />
            </div>
            <div className="add-post-button">
              <Link to="/new">
                <button>Add a New Post</button>
              </Link>
            </div>
          </div>

          {newPosts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )

          
}

export default MainHome
