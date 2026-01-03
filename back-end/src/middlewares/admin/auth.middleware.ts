import { Request, Response, NextFunction } from 'express'
import Account from '~/models/account.model'
import { StatusCodes } from 'http-status-codes'
import { JWTProvider } from '~/providers/jwt.provider'
import Role from '~/models/role.model'

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken
    if (!accessToken) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Vui lòng gửi kèm token!' })
      return
    }
    const accessTokenDecoded = await JWTProvider.verifyToken(
      accessToken, 
      process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN
    ) as {
      accountId: string,
      email: string,
      role_id: string  
    }
    if (!accessTokenDecoded) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token không hợp lệ!!' })
      return
    }
    const accountAdmin = await Account.findOne({
      _id: accessTokenDecoded.accountId,
      deleted: false,
      status: 'ACTIVE'
    })
  
    if (!accountAdmin) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Người quản trị không tồn tại!' })
      return
    }

    const role = await Role.findOne({
      _id: accountAdmin.role_id,
      deleted: false
    })
    if (!role){
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Không thể xác định quyền tài khoản!' })
      return
    }
    req['accountAdmin'] = accountAdmin
    req['accountAdmin.roleName'] = role.titleId
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