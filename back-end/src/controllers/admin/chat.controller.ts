import { Request, Response } from 'express'
import * as chatService from '~/services/admin/chat.service'

// Lấy danh sách tất cả các cuộc trò chuyện
// [GET] /admin/chats
export const getAdminChatRooms = async (req: Request, res: Response) => {
  try {
    const chatRooms = await chatService.getAdminChatRooms()

    res.json({ code: 200, chatRooms })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}

// Lấy toàn bộ lịch sử của một phòng chat cụ thể
// [GET] /admin/chats/:userId
export const getAdminChatHistory = async (req: Request, res: Response) => {
  try {
    const chat = await chatService.getAdminChatHistory(req.params.userId)

    if (!chat) {
      return res.json({ code: 404, message: 'Không tìm thấy cuộc trò chuyện.' })
    }

    res.json({ code: 200, chat })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}