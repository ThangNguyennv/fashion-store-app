/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, type FormEvent } from 'react'
import { fetchAdminChatRoomsAPI, fetchAdminChatHistoryAPI } from '~/apis/admin/chat.api'
import { API_ROOT } from '~/utils/constants'
import io from 'socket.io-client'
import Skeleton from '@mui/material/Skeleton'
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import type { ChatRoom, Message } from '~/types/chat.type'
import { useAuth } from '~/contexts/admin/AuthContext'
import clsx from 'clsx'

const AdminChatPage = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const socketRef = useRef<ReturnType<typeof io> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { myAccount } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Lấy danh sách phòng chat
  useEffect(() => {
    if (!myAccount) return

    const getRooms = async () => {
      try {
        setLoadingRooms(true)
        // API này sẽ tự động gửi cookie 'tokenAdmin'
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

    socket.emit('ADMIN_JOIN_ROOM', 'ADMIN_ROOM')

    socket.on('SERVER_RECEIVE_MESSAGE', (newMessage: Message & { user_id: string }) => {
      setActiveRoom(prevRoom => {
        // Chỉ thêm tin nhắn nếu admin đang mở đúng phòng
        if (prevRoom && newMessage.user_id === prevRoom.user_id._id) {
          setMessages(prevMessages => [...prevMessages, newMessage])
        }
        return prevRoom
      })
    })

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
      socketRef.current.emit('ADMIN_LEAVE_ROOM', activeRoom.user_id._id)
    }

    setActiveRoom(room)
    setLoadingMessages(true)

    try {
      const res = await fetchAdminChatHistoryAPI(room.user_id._id)
      if (res.code === 200) {
        setMessages(res.chat.messages)
        socketRef.current?.emit('ADMIN_JOIN_ROOM', room.user_id._id)
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

    socketRef.current.emit('ADMIN_SEND_MESSAGE', {
      userId: activeRoom.user_id._id,
      content: newMessage
    })
    setNewMessage('')
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100] w-full overflow-hidden">
      {/* Cột 1: Danh sách phòng chat */}
      <div className={clsx(
        'flex-col border-r bg-white overflow-y-auto',
        activeRoom ? 'hidden md:flex' : 'flex w-full',
        'md:w-1/3 lg:w-1/4'
      )}>
        <header className="p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Tin nhắn</h2>
        </header>
        <div className="flex flex-col">
          {loadingRooms ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton variant="circular" width={48} height={48} />
                  <div className="flex-1">
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="90%" height={16} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            rooms.map((room) => (
              <button
                key={room._id}
                onClick={() => handleSelectRoom(room)}
                className={`flex items-center gap-3 p-4 w-full text-left transition-colors ${
                  activeRoom?._id === room._id
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {room.user_id?.avatar ? (
                  <img src={room.user_id.avatar} alt={room.user_id.fullName} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <FaUserCircle size={48} className="text-gray-400" />
                )}
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold truncate">{room.user_id?.fullName}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {room.messages[room.messages.length - 1]?.content || 'Chưa có tin nhắn'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Cột 2: Nội dung chat */}
      <div className={clsx(
        'flex-col',
        activeRoom ? 'flex w-full' : 'hidden',
        'md:flex md:w-2/3 lg:w-3/4'
      )}>
        {!activeRoom ? (
          <div className="flex-1 hidden md:flex items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        ) : (
          <>
            {/* Header phòng chat */}
            <header className="p-4 border-b bg-white flex items-center gap-3 shadow-sm sticky top-0 z-10">
              <button
                className="md:hidden p-1 mr-2 text-gray-600"
                onClick={() => setActiveRoom(null)} // Bấm để quay lại danh sách
              >
                <FaArrowLeft size={18} />
              </button>
              {activeRoom.user_id.avatar ? (
                <img src={activeRoom.user_id.avatar} alt={activeRoom.user_id.fullName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <FaUserCircle size={40} className="text-gray-400" />
              )}
              <h2 className="text-lg font-bold">{activeRoom.user_id.fullName}</h2>
            </header>

            {/* Khu vực tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {loadingMessages ? (
                <div className="space-y-4">
                  <Skeleton variant="rounded" width="60%" height={40} />
                  <Skeleton variant="rounded" width="70%" height={50} sx={{ ml: 'auto' }} />
                  <Skeleton variant="rounded" width="50%" height={40} />
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex my-2 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                        msg.sender === 'admin'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input gửi tin nhắn */}
            <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2 bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border rounded-full py-2 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loadingMessages}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:bg-gray-400"
                disabled={loadingMessages || !newMessage.trim()}
              >
                <IoIosSend />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminChatPage

