const Post = ({posts}) =>{
    return (
    <div className="post-list">
        {posts.map((post, index) => (
          <div key={index} className="post-card">
            <img src={`http://localhost:3001/uploads/${post.postImage}`} alt="Post" />
            <p>{post.postDescription}</p>
          </div>
        ))}
      </div>
    )
}
export default Post