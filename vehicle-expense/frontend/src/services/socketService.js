import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
    
    this.socket = io(socketUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      this.isConnected = true
      console.log('Socket connected:', this.socket.id)
    })

    this.socket.on('disconnect', () => {
      this.isConnected = false
      console.log('Socket disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  joinRoom(room) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-room', room)
    }
  }

  leaveRoom(room) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-room', room)
    }
  }

  onExpenseShared(callback) {
    if (this.socket) {
      this.socket.on('expense_shared', callback)
    }
  }

  onShareStatusUpdated(callback) {
    if (this.socket) {
      this.socket.on('share_status_updated', callback)
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on('notification', callback)
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }
}

export default new SocketService()
