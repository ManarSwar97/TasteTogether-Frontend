import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateRoom = () => {
  const navigate = useNavigate()

  const initialState = {
    roomName: '',
    description: ''
  }

  const [roomState, setRoomState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { id, value } = event.target
    setRoomState({ ...roomState, [id]: value })
    if (value.trim()) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!roomState.roomName.trim()) {
      setError('Room name is required')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:3001/room/create',
        {
          roomName: roomState.roomName.trim(),
          description: roomState.description.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      const newRoom = response.data
      navigate(`/room/${newRoom.roomId}`)
    } catch (error) {
      console.error(error)
      setError(error.response?.data?.msg || 'Failed to create room')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="create-room-form">
      <h2 className="create-room-title">Create a Video Call Room</h2>

      <input
        type="text"
        id="roomName"
        value={roomState.roomName}
        onChange={handleChange}
        placeholder="Room Name"
        required
        className="create-room-input"
      />

      <textarea
        id="description"
        value={roomState.description}
        onChange={handleChange}
        placeholder="Room Description (optional)"
        className="create-room-textarea"
      />

      {error && <p className="create-room-error">{error}</p>}

      <button
        type="submit"
        disabled={loading || !roomState.roomName.trim()}
        className="create-room-submit"
      >
        {loading ? 'Creating...' : 'Create Room'}
      </button>
    </form>
  )
}

export default CreateRoom
