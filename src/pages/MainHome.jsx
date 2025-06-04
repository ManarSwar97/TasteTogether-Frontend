import { Link } from "react-router-dom"
import Post from "../components/Post"
const MainHome = ({user, posts}) => {
  return (
    <div className="main-home">
      <div className="signed-in-message">
        <h2>Welcome back! You're signed in 🎉</h2>
      </div>
      <div className="add-post">
        <Link to="/new">
        <button>Add a New Post</button>
        </Link>
      </div>
        <Post posts={posts} />

    </div>
  )
}

export default MainHome
