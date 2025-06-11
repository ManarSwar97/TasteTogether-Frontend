import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const RoomsList = () => {
  const [rooms, setRooms] = useState([])
  const navigate = useNavigate()

  const currentUserId = localStorage.getItem('userId')

  useEffect(() => {
    const Rooms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/room')
        console.log('Fetched rooms:', response.data.rooms)
        setRooms(response.data.rooms || [])
      } catch (error) {
        console.error('Failed to fetch rooms:', error)
      }
    }
    Rooms()
  }, [])

  const toggleRoomActive = async (roomId, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `http://localhost:3001/room/${roomId}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      console.log('Backend response:', response.data)

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
    <div className="rooms-list">
      <Link to="/create" className="rooms-list__create-link">
        + Create New Room
      </Link>
      <h2 className="rooms-list__title">Available Rooms</h2>
      {rooms.length === 0 ? (
        <p className="rooms-list__empty">No rooms available. Create one!</p>
      ) : (
        <ul className="rooms-list__items">
          {rooms.map((room, index) => {
            const isCreator = room.createdBy?.toString() === currentUserId
            const isInactive = room.isActive === false

            return (
              <li
                key={room._id || room.roomId || index}
                className={`rooms-list__item ${
                  isInactive ? 'rooms-list__item--inactive' : ''
                }`}
              >
                <h3 className="rooms-list__item-title">{room.roomName}</h3>
                {room.description && (
                  <p className="rooms-list__item-description">{room.description}</p>
                )}

                {isCreator && (
                  <label className="rooms-list__active-toggle-label">
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
                  className={`rooms-list__join-button ${
                    isInactive ? 'rooms-list__join-button--inactive' : ''
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
