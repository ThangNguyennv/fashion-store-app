/* eslint-disable no-console */
import { useState, useEffect, useRef, type FormEvent } from 'react'
import io from 'socket.io-client'
import { fetchClientChatAPI } from '~/apis/client/chat.api'
import { API_ROOT } from '~/utils/constants'
import type { Message } from '~/types/chat.type'
import { useAuth } from '~/contexts/client/AuthContext'

const useChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const socketRef = useRef<ReturnType<typeof io> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { accountUser } = useAuth()
  // useEffect(() => {
  //   fetchInfoUserAPI().then((response: UserDetailInterface) => {
  //     setAccountUser(response.accountUser)
  //   })
  // }, [setAccountUser])
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Logic kết nối Socket và lấy lịch sử chat
  // Sẽ CHỈ chạy khi người dùng MỞ cửa sổ chat (isOpen = true)
  useEffect(() => {
    if (isOpen) {
      // Nếu không có user (chưa đăng nhập), chỉ cần tắt loading
      if (!accountUser) {
        setLoading(false)
        setMessages([]) // Đảm bảo tin nhắn cũ được xóa
        return
      }

      // Nếu ĐÃ đăng nhập, tiến hành thiết lập chat
      const setupChat = async () => {
        try {
          setLoading(true)
          // Lấy lịch sử chat (API này tự động dùng cookie httpOnly)
          const res = await fetchClientChatAPI()
          if (res.code === 200) {
            setMessages(res.chat.messages)
          }

          // Kết nối socket, gửi kèm cookie xác thực
          const socket = io(API_ROOT, {
            transportOptions: {
              polling: {
                withCredentials: true // Rất quan trọng để gửi cookie
              }
            }
          })
          socketRef.current = socket

          // Yêu cầu join phòng (backend sẽ tự đọc cookie để biết user_id)
          socket.emit('CLIENT_JOIN_ROOM')

          // Lắng nghe tin nhắn mới từ server
          socket.on('SERVER_RECEIVE_MESSAGE', (newMessage: Message & { user_id: string }) => {
            setMessages((prevMessages) => [...prevMessages, newMessage])
          })

        } catch (error) {
          console.error('Không thể khởi tạo chat:', error)
        } finally {
          setLoading(false)
        }
      }
      setupChat()

      // Cleanup: Ngắt kết nối socket khi đóng cửa sổ chat
      return () => {
        socketRef.current?.disconnect()
      }
    }
  }, [isOpen, accountUser]) // Phụ thuộc vào `isOpen` và `accountUser`

  // Tự động cuộn khi có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  // Gửi tin nhắn
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socketRef.current || !accountUser) return
    socketRef.current.emit('CLIENT_SEND_MESSAGE', newMessage)
    setNewMessage('')
  }

  return {
    setIsOpen,
    handleSubmit,
    loading,
    isOpen,
    accountUser,
    messages,
    messagesEndRef,
    newMessage,
    setNewMessage
  }
}

export default useChat