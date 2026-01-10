import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as chatService from '~/services/admin/chat.service'

// Lấy danh sách tất cả các cuộc trò chuyện
// [GET] /admin/chats
export const getAdminChatRooms = async (req: Request, res: Response) => {
  try {
    const chatRooms = await chatService.getAdminChatRooms()

    res.status(StatusCodes.OK).json({ 
      code: 200, 
      chatRooms 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// Lấy toàn bộ lịch sử của một phòng chat cụ thể
// [GET] /admin/chats/:userId
export const getAdminChatHistory = async (req: Request, res: Response) => {
  try {
    const chat = await chatService.getAdminChatHistory(req.params.userId)

    if (!chat) {
      res.status(StatusCodes.NOT_FOUND).json({ 
        code: 404, 
        message: 'Không tìm thấy cuộc trò chuyện.' 
      })
      return
    }

    res.status(StatusCodes.OK).json({ 
      code: 200, 
      chat 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}