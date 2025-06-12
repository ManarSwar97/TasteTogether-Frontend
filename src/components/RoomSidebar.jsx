import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../stylesheet/roomSidebar.css'

const RoomSidebar = ({ user }) => {
  if (!user) return null

  const [activeRooms, setActiveRooms] = useState([])

  useEffect(() => {
    const activeRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/room')
        const rooms = response.data.rooms || []
        const filteredRooms = rooms.filter((room) => room.isActive)
        setActiveRooms(filteredRooms)
      } catch (error) {
        console.error('Failed to fetch rooms:', error)
      }
    }

    activeRooms()
  }, [])

  return (
    <div className="room-sidebar">
      <div className="room-bar-links">
        <h3 className="room-bar-header">Rooms</h3>
        {activeRooms.length === 0 ? (
          <p>No active rooms</p>
        ) : (
          activeRooms.map((room) => (
            <Link key={room._id || room.roomId} to={`/room/${room.roomId}`}>
              <img
                className="icon"
                src="https://i.imgur.com/zy9qAdt.png"
                alt="`Room`"
              />{' '}
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
