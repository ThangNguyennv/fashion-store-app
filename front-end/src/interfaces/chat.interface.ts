import type { UserInfoInterface } from './user.interface'

export interface Message {
  _id: string
  sender: 'user' | 'admin'
  content: string
  read: boolean
  createdAt: string
  updatedAt: string
}

export interface Chat {
  _id: string
  user_id: UserInfoInterface | string
  messages: Message[]
  lastMessageAt: string
}

export interface ChatRoom {
  _id: string
  user_id: UserInfoInterface // Dữ liệu user đã được populate
  messages: Message[] // Thường chỉ chứa tin nhắn cuối cùng
  lastMessageAt: string
}

export interface ClientChatAPIResponse {
  code: number
  message?: string
  chat: Chat
}

export interface AdminChatRoomsAPIResponse {
  code: number
  message?: string
  chatRooms: ChatRoom[]
}

export interface AdminChatHistoryAPIResponse {
  code: number
  message?: string
  chat: Chat
}
