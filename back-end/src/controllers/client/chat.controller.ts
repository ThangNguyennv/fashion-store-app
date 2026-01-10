import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as chatService from '~/services/client/chat.service'

// Lấy hoặc tạo phòng chat cho client đang đăng nhập
// [GET] /chats
export const getChat = async (req: Request, res: Response) => {
  try {
    const chat = await chatService.getChat(req['accountUser']._id)
    
    res.status(StatusCodes.OK).json({ 
      code: 200, 
      chat 
    })
  } catch (error) {
    console.error('Lỗi khi lấy client chat:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
