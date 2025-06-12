import { useState, useEffect } from "react";
import axios from 'axios'
const Comment = ({postId}) => {

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showAll, setShowAll] = useState(false);


  useEffect(() => {
    const fetchComments = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:3001/comments/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);
  
const onClickHandler = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:3001/comments',
      {
        comment,
        postId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const newComment = response.data;
    setComments((prevComments) => [...prevComments, newComment]);
    setComment("");
  } catch (error) {
    console.error("Error posting comment:", error);
  }
};


  const onChangeHandler = (e) => {
    setComment(e.target.value);
  };

  const toggleComments = () => {
    setShowAll(!showAll);
  };

  //source: https://www.w3schools.com/js/js_array_methods.asp#mark_slice
  //slice will slice out a piece of an array into new array 
  //if showAll is false it'll show only the last 3 comments from comments array || if showAll is true it'll display the whole comments array
  //and then save the results into visibleComments variable
  const visibleComments = showAll ? comments : comments.slice(-3);

  return (
    <div className="comment-section">
      {visibleComments.map((text) => (
        <div className="comment-container" key={text._id}>
          <div className='post-user-info'>
            <img src={`http://localhost:3001/uploads/${text.user.image}`} alt="user profile" />
            <p>{text.user.username}</p>
          </div>
          <p className="comment-content">{text.comment}</p>
        </div>
      ))}
      {comments.length > 3 && (
        <button className="toggle-button" onClick={toggleComments}>
          {showAll ? "Hide" : "View all"}
        </button>
      )}
      <div className="comment-form">
        <input
          type="text"
          name="comment"
          id="comment"
          value={comment}
          onChange={onChangeHandler}
          placeholder="leave a comment"
        />
        <button onClick={onClickHandler}>Submit</button>
      </div>
    </div>
  );
};

export default Comment;
