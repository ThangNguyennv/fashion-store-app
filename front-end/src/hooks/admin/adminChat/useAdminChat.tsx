
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, type FormEvent } from 'react'
import { fetchAdminChatRoomsAPI, fetchAdminChatHistoryAPI } from '~/apis/admin/chat.api'
import { API_ROOT } from '~/utils/constants'
import io from 'socket.io-client'
import type { ChatRoom, Message } from '~/interfaces/chat.interface'
import { useAuth } from '~/contexts/admin/AuthContext'

const useAdminChat = () => {
  const { myAccount } = useAuth()

  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Lưu socket xuyên suốt vòng đời component
  const socketRef = useRef<ReturnType<typeof io> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Lấy danh sách phòng chat
  useEffect(() => {
    if (!myAccount) return

    const getRooms = async () => {
      try {
        setLoadingRooms(true)
        // API này sẽ tự động gửi cookie 'accessToken'
        const res = await fetchAdminChatRoomsAPI()
        if (res.code === 200) {
          setRooms(res.chatRooms)
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng chat:', error)
      } finally {
        setLoadingRooms(false)
      }
    }

    getRooms()
  }, [myAccount])

  // Khởi tạo Socket
  useEffect(() => {
    if (!myAccount) return

    const socket = io(API_ROOT, {
      withCredentials: true
    } as any)
    socketRef.current = socket

    socket.emit('ADMIN_CLIENT_JOIN_ROOM', 'ADMIN_ROOM') // event: 'ADMIN_CLIENT_JOIN_ROOM', data: 'ADMIN_ROOM'

    socket.on('SERVER_RETURN_MESSAGE', (newMessage: Message & { user_id: string }) => {
      setActiveRoom(prevRoom => {
        // Chỉ thêm tin nhắn nếu admin đang mở đúng phòng
        if (prevRoom && newMessage.user_id === prevRoom.user_id._id) {
          setMessages(prevMessages => [...prevMessages, newMessage])
        }
        return prevRoom
      })
    })

    // Đưa tin nhắn mới nhất lên đầu tiên của lịch sử chat
    socket.on('NEW_MESSAGE_NOTIFICATION', (data: { chatRoom: ChatRoom }) => {
      setRooms(prevRooms => {
        const existingRoom = prevRooms.find(r => r._id === data.chatRoom._id)
        if (existingRoom) {
          return [data.chatRoom, ...prevRooms.filter(r => r._id !== data.chatRoom._id)]
        } else {
          return [data.chatRoom, ...prevRooms]
        }
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [myAccount])

  // Lấy lịch sử khi chọn phòng
  const handleSelectRoom = async (room: ChatRoom) => {
    if (!myAccount || (activeRoom && activeRoom._id === room._id)) return

    if (activeRoom && socketRef.current) {
      socketRef.current.emit('ADMIN_CLIENT_LEAVE_ROOM', activeRoom.user_id._id)
    }

    setActiveRoom(room)
    setLoadingMessages(true)

    try {
      const res = await fetchAdminChatHistoryAPI(room.user_id._id)
      if (res.code === 200) {
        setMessages(res.chat.messages)
        socketRef.current?.emit('ADMIN_CLIENT_JOIN_ROOM', room.user_id._id)
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử chat:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socketRef.current || !activeRoom) return

    socketRef.current.emit('ADMIN_CLIENT_SEND_MESSAGE', {
      userId: activeRoom.user_id._id,
      content: newMessage
    })
    setNewMessage('')
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return {
    rooms,
    loadingRooms,
    loadingMessages,
    handleSelectRoom,
    handleSubmit,
    activeRoom,
    setActiveRoom,
    messages,
    messagesEndRef,
    newMessage,
    setNewMessage
  }
}

export default useAdminChat