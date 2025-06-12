import axios from 'axios'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import '../stylesheet/RandomProfile.css'
const RandomProfile = () => {
  const [users, setUsers] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users')
        setUsers(response.data)
      } catch (err) {
        console.error('Failed to fetch users')
      }
    }

    fetchUsers()
  }, [])

  const pickRandom = () => {
    if (users.length > 0) {
      const random = users[Math.floor(Math.random() * users.length)]
      setProfile(random)

      // Fireworks effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  return (
    <div className="rp-container">
      <div className="rp-profile-wrapper">
        <h2 className="rp-title">Random User</h2>
        {profile ? (
          <div className="rp-profile-card">
            <img
              src={`http://localhost:3001/uploads/${
                profile.image || 'default.jpg'
              }`}
              alt="Profile"
              className="rp-profile-image"
            />
            <h3 className="rp-username">{profile.username}</h3>
            <p className="rp-fullname">
              {profile.firstName} {profile.lastName}
            </p>
          </div>
        ) : (
          <p className="rp-no-selection">
            No user selected. Click below to pick one.
          </p>
        )}

        <button onClick={pickRandom} className="rp-btn-random">
          Random Profile
        </button>
      </div>
    </div>
  )
}

export default RandomProfile
