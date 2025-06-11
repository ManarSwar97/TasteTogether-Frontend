import axios from "axios";
import { useState, useEffect } from "react";

const RandomProfile = () => {
const [users, setUsers] = useState([])
const [profile, setProfile] = useState(null);

useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users')
        setUsers(response.data)
      } catch (err) {
        setError("Failed to fetch users")
      }
    }

    fetchUsers()
}, [])
  const pickRandom = () => {
    if (users.length > 0) {
      const random = users[Math.floor(Math.random() * users.length)];
      setProfile(random)

    }
  };




return (
    <div className="random-profile">
      <div className="profile-container">
        <h2>Random User Generator</h2>
        {profile ? (
          <div className="profile-card">
            <img
              src={`http://localhost:3001/uploads/${profile.image || 'default.jpg'}`}
              alt="Profile"
              className="profile-image"
            />
            <h3>{profile.username}</h3>
            <p>{profile.firstName} {profile.lastName}</p>
          </div>
        ) : (
          <p>No user selected. Click below to pick one.</p>
        )}

        <button onClick={pickRandom} className="random-btn">
          Generate Random Profile
        </button>

      </div>
    </div>
  )
}


export default RandomProfile;
