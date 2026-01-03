import { Request, Response, NextFunction } from 'express'
import User from '~/models/user.model'
import { StatusCodes } from 'http-status-codes'
import { JWTProvider } from '~/providers/jwt.provider'

export const requireAuth = async (
  req: Request, 
      res: Response,
      next: NextFunction
): Promise<void> => {
  try {
    const accessTokenUser = req.cookies.accessTokenUser 
    if (!accessTokenUser) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Vui lòng gửi kèm token!' })
      return
    }
    const accessTokenUserDecoded = await JWTProvider.verifyToken(
      accessTokenUser, 
      process.env.JWT_ACCESS_TOKEN_SECRET_CLIENT
    ) as { userId: string }
    if (!accessTokenUserDecoded) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token không hợp lệ!!' })
      return
    }
    const user = await User.findOne({
      _id: accessTokenUserDecoded.userId,
      deleted: false,
      status: 'ACTIVE'
    })
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Người dùng không tồn tại!' })
      return
    }
    req['accountUser'] = user 
    next() 
  } catch (error) {
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Cần refresh token mới!' })
      return
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại!' })
    return
  }
}