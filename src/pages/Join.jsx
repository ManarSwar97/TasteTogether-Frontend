import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Join = () => {
  const [room, setRoom] = useState('')
  const navigate = useNavigate()

  const onJoin = () => {
    if (room.trim()) {
      navigate(`/room/${room.trim()}`)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        style={{ padding: 8, fontSize: 16, width: 300 }}
      />
      <button onClick={onJoin} style={{ marginLeft: 10, padding: '8px 16px' }}>
        Join
      </button>
    </div>
  )
}

export default Join
