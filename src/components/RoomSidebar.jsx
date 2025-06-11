import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const RoomSidebar = ({ user }) => {
  const [activeRooms, setActiveRooms] = useState([])

  useEffect(() => {
    const ActiveRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/room')
        const rooms = response.data.rooms || []
        const filteredRooms = rooms.filter(room => room.isActive)
        setActiveRooms(filteredRooms)
      } catch (error) {
        console.error('Failed to fetch rooms:', error)
      }
    }

    ActiveRooms()
  }, [])

  return (
    <div className="room-bar">
      <div className="room-bar-links">
        <h3 className="room-bar-header">Rooms</h3>
        {activeRooms.length === 0 ? (
          <p>No active rooms</p>
        ) : (
          activeRooms.map(room => (
            <Link key={room._id || room.roomId} to={`/room/${room.roomId}`}>
              {room.roomName}
            </Link>
          ))
        )}
      </div>

      <div className="room-bar-bottom">
        <Link to="/rooms">
          <button>View All Rooms</button>
        </Link>
      </div>
    </div>
  )
}

export default RoomSidebar
