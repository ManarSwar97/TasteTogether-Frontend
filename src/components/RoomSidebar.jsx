import { Link } from 'react-router-dom'

const RoomSidebar = ({ user }) => {
  return (
    <div className="room-bar">
      <div className="room-bar-links">
        <Link to="/rooms">Room 1</Link>
        <Link to="/rooms/2">Room 2</Link>
        <Link to="/rooms/3">Room 3</Link>
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
