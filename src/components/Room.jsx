import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import SimplePeer from 'simple-peer'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  MonitorX
} from 'lucide-react'

import '../stylesheet/Room.css'
const SERVER_URL = 'http://localhost:3001'

const getImageUrl = (image) => {
  if (!image) return null
  if (image.startsWith('http') || image.startsWith('data:')) return image
  return `${SERVER_URL}/uploads/${image}`
}

const Room = ({ user }) => {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const localVideoRef = useRef(null)
  const [remoteStreams, setRemoteStreams] = useState({})
  const [usersInfo, setUsersInfo] = useState({})
  const socketRef = useRef(null)
  const peersRef = useRef({})
  const localStreamRef = useRef(null)
  const signalBufferRef = useRef({})
  const bufferedUsers = useRef([])

  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [screenSharing, setScreenSharing] = useState(false)

  const { username, image } = user || {}

  // NEW: Manage maximized video id (null means no maximized video)
  const [maximizedId, setMaximizedId] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/signin')
      return
    }

    socketRef.current = io(SERVER_URL)

    socketRef.current.emit('join-room', { roomId, username, image })

    socketRef.current.on('all-users', (users) => {
      const info = {}
      users.forEach(({ id, username, image }) => {
        info[id] = { username, image }
      })
      setUsersInfo(info)

      if (localStreamRef.current) {
        users.forEach(({ id }) => createPeer(id, false))
      } else {
        bufferedUsers.current = users.map((u) => u.id)
      }
    })

    socketRef.current.on('user-joined', (user) => {
      setUsersInfo((prev) => ({
        ...prev,
        [user.id]: { username: user.username, image: user.image }
      }))

      if (localStreamRef.current) {
        createPeer(user.id, true)
      } else {
        bufferedUsers.current.push(user.id)
      }
    })

    socketRef.current.on('signal', ({ from, signal }) => {
      const peer = peersRef.current[from]
      if (peer && typeof peer.signal === 'function') {
        peer.signal(signal)
      } else {
        if (!signalBufferRef.current[from]) {
          signalBufferRef.current[from] = []
        }
        signalBufferRef.current[from].push(signal)
      }
    })

    socketRef.current.on('user-disconnected', (userId) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].destroy()
        delete peersRef.current[userId]
        setRemoteStreams((prev) => {
          const copy = { ...prev }
          delete copy[userId]
          return copy
        })
      }
      setUsersInfo((prev) => {
        const copy = { ...prev }
        delete copy[userId]
        return copy
      })
    })

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
        bufferedUsers.current.forEach((userId) => createPeer(userId, false))
        bufferedUsers.current = []
      })
      .catch((err) => {
        console.error('Error getting user media:', err)
        alert('Could not get access to camera/microphone.')
      })

    return () => cleanup()
  }, [roomId, user])

  function cleanup() {
    socketRef.current?.disconnect()
    localStreamRef.current?.getTracks().forEach((track) => track.stop())
    Object.values(peersRef.current).forEach((peer) => peer.destroy())
    peersRef.current = {}
    setRemoteStreams({})
    setUsersInfo({})
  }

  function createPeer(userId, initiator) {
    if (!localStreamRef.current) return

    const peer = new SimplePeer({
      initiator,
      trickle: false,
      stream: localStreamRef.current
    })

    peer.on('signal', (signal) => {
      socketRef.current.emit('signal', { roomId, to: userId, signal })
    })

    peer.on('stream', (remoteStream) => {
      setRemoteStreams((prev) => ({ ...prev, [userId]: remoteStream }))
    })

    peer.on('close', () => {
      setRemoteStreams((prev) => {
        const copy = { ...prev }
        delete copy[userId]
        return copy
      })
      delete peersRef.current[userId]
    })

    peersRef.current[userId] = peer

    if (signalBufferRef.current[userId]) {
      signalBufferRef.current[userId].forEach((bufferedSignal) => {
        peer.signal(bufferedSignal)
      })
      delete signalBufferRef.current[userId]
    }
  }

  const toggleAudio = () => {
    if (!localStreamRef.current) return
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled
      setAudioEnabled(track.enabled)
    })
  }

  const toggleVideo = () => {
    if (!localStreamRef.current) return
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled
      setVideoEnabled(track.enabled)
    })
  }

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        })

        replaceStreamTracks(screenStream)
        screenStream.getVideoTracks()[0].onended = () => stopScreenShare()
        setScreenSharing(true)
      } catch (err) {
        console.error('Error sharing screen:', err)
      }
    } else {
      stopScreenShare()
    }
  }

  const stopScreenShare = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: audioEnabled
      })
      replaceStreamTracks(cameraStream)
      setScreenSharing(false)
    } catch (err) {
      console.error('Failed to get camera stream after screen share:', err)
    }
  }

  const replaceStreamTracks = (newStream) => {
    const oldStream = localStreamRef.current
    localStreamRef.current = newStream
    if (localVideoRef.current) localVideoRef.current.srcObject = newStream

    Object.values(peersRef.current).forEach((peer) => {
      oldStream.getTracks().forEach((oldTrack) => {
        const newTrack = newStream
          .getTracks()
          .find((t) => t.kind === oldTrack.kind)
        if (newTrack) {
          peer.replaceTrack(oldTrack, newTrack, oldStream)
        }
      })
    })
  }

  const disconnectCall = () => {
    cleanup()
    navigate('/rooms')
  }

  // NEW: click handler for toggle maximize/minimize video
  const handleVideoClick = (id) => {
    setMaximizedId((prevId) => (prevId === id ? null : id))
  }

  return (
    <div className="room-container">
      <h2 className="room-header">Room ID: {roomId}</h2>

      <div className="room-video-container">
        {/* Local video card */}
        <div
          className={`room-video-card ${
            maximizedId === 'local'
              ? 'maximized'
              : maximizedId
              ? 'minimized'
              : ''
          }`}
          onClick={() => handleVideoClick('local')}
        >
          <div className="room-user-info">
            {image && (
              <img
                src={getImageUrl(image)}
                alt={username}
                className="room-profile-image"
                loading="lazy"
              />
            )}
            <span className="room-username">{username}</span>
          </div>

          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="room-video"
          />

          <div className="room-controls">
            <button
              onClick={toggleAudio}
              className={`room-btn audio-btn ${
                audioEnabled ? 'enabled' : 'disabled'
              }`}
              title={audioEnabled ? 'Mute' : 'Unmute'}
            >
              {audioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`room-btn video-btn ${
                videoEnabled ? 'enabled' : 'disabled'
              }`}
              title={videoEnabled ? 'Stop Video' : 'Start Video'}
            >
              {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`room-btn screen-btn ${screenSharing ? 'active' : ''}`}
              title={screenSharing ? 'Stop Sharing' : 'Share Screen'}
            >
              {screenSharing ? (
                <MonitorX size={24} />
              ) : (
                <ScreenShare size={24} />
              )}
            </button>

            <button
              onClick={disconnectCall}
              className="room-btn disconnect-btn"
              title="Disconnect"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>

        {/* Remote videos */}
        <div className="room-remote-container">
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <div
              key={id}
              className={`room-remote-video-card ${
                maximizedId === id
                  ? 'maximized'
                  : maximizedId
                  ? 'minimized'
                  : ''
              }`}
              title={usersInfo[id]?.username || 'Unknown'}
              onClick={() => handleVideoClick(id)}
            >
              <div className="room-user-info">
                {usersInfo[id]?.image && (
                  <img
                    src={getImageUrl(usersInfo[id].image)}
                    alt={usersInfo[id].username || 'User'}
                    className="room-profile-image"
                    loading="lazy"
                  />
                )}
                <span className="room-username">{usersInfo[id]?.username}</span>
              </div>
              <video
                autoPlay
                playsInline
                className="room-video"
                ref={(video) => {
                  if (video && stream) {
                    video.srcObject = stream
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Room
