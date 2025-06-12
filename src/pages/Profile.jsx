import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Comment from '../components/Comment'
import '../stylesheet/profile.css'
const Profile = () => {
  const { user_id } = useParams() // get user_id from URL
  const [profileUser, setProfileUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // get current logged-in user id from localStorage
  const currentUserId = localStorage.getItem('userId') || null

  useEffect(() => {
    if (!user_id) return // if there's no user_id, return nothing

    // to show the data is loading
    setLoading(true)

    const UserAndPosts = async () => {
      try {
        // axios call to get the user
        const userResponse = await axios.get(
          `http://localhost:3001/users/${user_id}`
        )
        // axios call to get the user posts
        const postsResponse = await axios.get(
          `http://localhost:3001/posts?user=${user_id}`
        )

        setProfileUser(userResponse.data.user) // set the profile user
        setUserPosts(postsResponse.data) // set `the` user posts
      } catch (err) {
        setError('Failed to load profile or posts')
      }
      setLoading(false) // loading finished
    }
    UserAndPosts()
  }, [user_id])

  if (loading) return <p className="pf-loading">Loading profile...</p>
  if (error) return <p className="pf-error">{error}</p>
  if (!profileUser) return <p className="pf-no-data">No profile found.</p>

  return (
    <div className="pf-page">
      <div className="pf-header">
        <img
          src={
            profileUser.image
              ? `http://localhost:3001/uploads/${profileUser.image}`
              : '/default-profile.png'
          }
          alt={`${profileUser.username} profile`}
          className="pf-image"
        />

        <h2 className="pf-username">{profileUser.username}</h2>
      </div>
      {/* if the current user is the same as the profile user */}
      {currentUserId === profileUser._id && (
        //show the edit profile
        <Link to={`/edit-profile/${profileUser._id}`}>
          <button className="pf-btn pf-btn-edit-profile">Edit Profile</button>
        </Link>
      )}

      <div className="pf-posts-grid">
        {/* Loop through user posts */}
        {userPosts.map((post) => (
          <div key={post._id} className="pf-post-wrapper">
            {/* Post image */}
            <img
              src={`http://localhost:3001/uploads/${post.postImage}`}
              alt="User post"
              className="pf-post-image"
              onClick={() => setSelectedPost(post)}
            />
          </div>
        ))}
      </div>

      {/* to show selected post in detail with comments and likes */}
      {selectedPost && (
        <div className="pf-modal" onClick={() => setSelectedPost(null)}>
          <div
            className="pf-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Post image */}
            <img
              src={`http://localhost:3001/uploads/${selectedPost.postImage}`}
              alt="Post preview"
              className="pf-modal-post-image"
            />
            {/* Post description */}
            <p className="pf-post-description">
              {selectedPost.postDescription}
            </p>

            {/* Likes count */}
            <p className="pf-post-likes">
              <strong>Likes:</strong> {selectedPost.likes?.length || 0}
            </p>

            {/* Comments section */}
            <div className="pf-comments-section">
              <Comment postId={selectedPost._id} />
            </div>

            {/* show edit/delete buttons only if current user owns this post */}
            {selectedPost.user?._id?.toString() === currentUserId && (
              <div className="pf-card-buttons">
                <Link
                  className="pf-edit-link"
                  to={`/update/${selectedPost._id}`}
                  onClick={() => setSelectedPost(null)}
                >
                  <button className="pf-btn pf-btn-edit">Edit</button>
                </Link>
                <button
                  className="pf-btn pf-btn-delete"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token')
                      await axios.delete(
                        `http://localhost:3001/posts/${selectedPost._id}`,
                        {
                          headers: { Authorization: `Bearer ${token}` }
                        }
                      )
                      // update posts list after deletion
                      setUserPosts((prevPosts) =>
                        prevPosts.filter((p) => p._id !== selectedPost._id)
                      )
                      setSelectedPost(null)
                    } catch (error) {
                      console.error('Error deleting post:', error)
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}

            {/* Close button */}
            <button
              className="pf-btn pf-btn-close"
              onClick={() => setSelectedPost(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
