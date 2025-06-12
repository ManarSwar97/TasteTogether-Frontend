import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import '../stylesheet/RoomList.css'
const RoomsList = () => {
  const [rooms, setRooms] = useState([])
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem('userId')

  useEffect(() => {
    const rooms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/room')
        setRooms(response.data.rooms || [])
      } catch (error) {
        console.error('Failed to fetch rooms:', error)
      }
    }
    rooms()
  }, [])

  const toggleRoomActive = async (roomId, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `http://localhost:3001/room/${roomId}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!response.data.room) {
        throw new Error('No updated room returned from backend')
      }

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.roomId === roomId ? response.data.room : room
        )
      )
    } catch (error) {
      console.error('Failed to update room status:', error)
      alert('Failed to update room status')
    }
  }

  return (
    <div className="rl-container">
      <Link to="/create" className="rl-create-link">
        + Create New Room
      </Link>
      <h2 className="rl-title">Available Rooms</h2>

      {rooms.length === 0 ? (
        <p className="rl-empty-message">No rooms available. Create one!</p>
      ) : (
        <ul className="rl-list">
          {rooms.map((room, index) => {
            const isCreator = room.createdBy?.toString() === currentUserId
            const isInactive = room.isActive === false

            return (
              <li
                key={room._id || room.roomId || index}
                className={`rl-item ${isInactive ? 'rl-item--inactive' : ''}`}
              >
                <h3 className="rl-item-name">{room.roomName}</h3>
                {room.description && (
                  <p className="rl-item-description">{room.description}</p>
                )}

                {isCreator && (
                  <label className="rl-toggle-label">
                    Active:{' '}
                    <input
                      type="checkbox"
                      checked={!isInactive}
                      onChange={() =>
                        toggleRoomActive(room.roomId, !isInactive)
                      }
                    />
                  </label>
                )}

                <button
                  className={`rl-join-btn ${
                    isInactive ? 'rl-join-btn--inactive' : ''
                  }`}
                  onClick={() => {
                    if (!isInactive) {
                      navigate(`/room/${room.roomId}`)
                    }
                  }}
                  disabled={isInactive}
                >
                  {isInactive ? 'Inactive' : 'Join Room'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default RoomsList
