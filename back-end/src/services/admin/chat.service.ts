import Chat from "~/models/chat.model"

export const getAdminChatRooms = async () => {
  const chatRooms = await Chat
    .find()
    .populate('user_id', 'fullName avatar') // Lấy thông tin user
    .sort({ lastMessageAt: -1 }) // Sắp xếp theo tin nhắn mới nhất
    .lean() // Dùng .lean() để tăng tốc độ
  return chatRooms
}

export const getAdminChatHistory = async (userId: string) => {
  const chat = await Chat
    .findOne({ user_id: userId })
    .populate('user_id', 'fullName avatar')
    .lean()
  return chat
}