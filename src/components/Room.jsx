import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import SimplePeer from 'simple-peer'

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

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Room ID: {roomId}</h2>

      <div style={styles.videoContainer}>
        <div style={styles.videoCard}>
          <div style={styles.userInfo}>
            {image && (
              <img
                src={getImageUrl(image)}
                alt={username}
                style={styles.profileImage}
                loading="lazy"
              />
            )}
            <span style={styles.username}>{username}</span>
          </div>

          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={styles.video}
          />

          <div style={styles.controls}>
            <button
              onClick={toggleAudio}
              className={`btn ${audioEnabled ? 'btn-success' : 'btn-danger'}`}
              title={audioEnabled ? 'Mute' : 'Unmute'}
            >
              {audioEnabled ? 'Mute' : 'Unmute'}
            </button>
            <button
              onClick={toggleVideo}
              className={`btn ${
                videoEnabled ? 'btn-primary' : 'btn-secondary'
              }`}
              title={videoEnabled ? 'Stop Video' : 'Start Video'}
            >
              {videoEnabled ? 'Stop Video' : 'Start Video'}
            </button>
            <button
              onClick={toggleScreenShare}
              className={`btn ${screenSharing ? 'btn-warning' : 'btn-info'}`}
              title={screenSharing ? 'Stop Share' : 'Share Screen'}
            >
              {screenSharing ? 'Stop Share' : 'Share Screen'}
            </button>
            <button
              onClick={disconnectCall}
              className="btn btn-danger"
              title="Leave Call"
            >
              Disconnect
            </button>
          </div>
        </div>

        <div style={styles.remoteContainer}>
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <div
              key={id}
              style={styles.remoteVideoCard}
              title={usersInfo[id]?.username || 'Unknown'}
            >
              <div style={styles.userInfo}>
                {usersInfo[id]?.image && (
                  <img
                    src={getImageUrl(usersInfo[id].image)}
                    alt={usersInfo[id].username || 'User'}
                    style={styles.profileImage}
                    loading="lazy"
                  />
                )}
                <span style={styles.username}>{usersInfo[id]?.username}</span>
              </div>
              <video
                autoPlay
                playsInline
                style={styles.video}
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

const styles = {
  container: {
    padding: 20,
    height: '100%',
    width: '100%',
    color: '#eee',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  videoContainer: {
    display: 'flex',
    gap: 40,
    overflowX: 'hidden',
    width: '100%',
    maxWidth: 1300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  videoCard: {
    flex: '0 0 450px',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 0 14px rgba(255,255,255,0.15)'
  },
  remoteContainer: {
    display: 'flex',
    gap: 28,
    overflowX: 'hidden',
    flex: 1,
    alignItems: 'center'
  },
  remoteVideoCard: {
    flex: '0 0 450px',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 0 14px rgba(255,255,255,0.15)'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 0 6px rgba(0,0,0,0.6)'
  },
  username: {
    fontWeight: '700',
    fontSize: 18
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#000'
  },
  controls: {
    marginTop: 18,
    display: 'flex',
    gap: 14,
    flexWrap: 'nowrap',
    justifyContent: 'center',
    width: '100%'
  }
}

export default Room
