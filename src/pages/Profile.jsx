import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Comment from '../components/Comment'

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
        setUserPosts(postsResponse.data) // set the user posts
      } catch (err) {
        setError('Failed to load profile or posts')
      }
      setLoading(false) // loading finished
    }
    UserAndPosts()
  }, [user_id])

  if (loading) return <p className="profile-loading">Loading profile...</p>
  if (error) return <p className="profile-error">{error}</p>
  if (!profileUser) return <p className="profile-no-data">No profile found.</p>

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={
            profileUser.image
              ? `http://localhost:3001/uploads/${profileUser.image}`
              : '/default-profile.png'
          }
          alt={`${profileUser.username} profile`}
          className="profile-image"
        />

        <h2 className="profile-username">{profileUser.username}</h2>
      </div>
      {/* if the current user is the same as the profile user */}
      {currentUserId === profileUser._id && (
        //show the edit profile 
        <Link to={`/edit-profile/${profileUser._id}`}>
          <button className="btn btn-edit-profile">Edit Profile</button>
        </Link>
      )}

      <div className="posts-grid">
        {/* Loop through user posts */}
        {userPosts.map((post) => (
          <div key={post._id} className="post-wrapper">
            {/* Post image */}
            <img
              src={`http://localhost:3001/uploads/${post.postImage}`}
              alt="User post"
              className="post-image"
              onClick={() => setSelectedPost(post)}
            />
          </div>
        ))}
      </div>

      {/* to show selected post in detail with comments and likes */}
      {selectedPost && (
        <div className="modal" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Post image */}
            <img
              src={`http://localhost:3001/uploads/${selectedPost.postImage}`}
              alt="Post preview"
              className="modal-post-image"
            />
            {/* Post description */}
            <p className="post-description">{selectedPost.postDescription}</p>

            {/* Likes count */}
            <p className="post-likes">
              <strong>Likes:</strong> {selectedPost.likes?.length || 0}
            </p>

            {/* Comments section */}
            <div className="comments-section">
              <Comment postId={selectedPost._id} />
            </div>

            {/* show edit/delete buttons only if current user owns this post */}
            {selectedPost.user?.toString() === currentUserId && (
              <div className="card-buttons">
                <Link
                  className="edit-link"
                  to={`/update/${selectedPost._id}`}
                  onClick={() => setSelectedPost(null)}
                >
                  <button className="btn btn-edit">Edit</button>
                </Link>
                <button
                  className="btn btn-delete"
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
              className="btn btn-close"
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
