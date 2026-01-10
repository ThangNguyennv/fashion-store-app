import { Request, Response } from 'express'
import { JWTProvider } from '~/providers/jwt.provider'
import { StatusCodes } from 'http-status-codes'
import Session from '~/models/session.model'
import crypto from 'crypto'
import { getCookieOptions } from '~/utils/constants'
import * as authService from '~/services/admin/auth.service'

// [POST] /admin/auth/login
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginAdmin(req.body)

    if (!result.success) {
      const statusCode = result.code === 401 ? StatusCodes.UNAUTHORIZED : StatusCodes.FORBIDDEN
      res.status(statusCode).json({
        code: result.code,
        message: result.message
      })
      return
    }
    // const parser = new UAParser(req.get("User-Agent"))
    // const device = parser.getDevice()
    // const os = parser.getOS()
    // const browser = parser.getBrowser()
    // const session = new Session({
    //   accountId: accountAdmin._id,
    //   refreshTokenHash: hashToken(refreshToken),
    //   userAgent: req.get('User-Agent'),
    //   ip: req.ip,
    //   // deviceName: `${device.vendor || "Unknown"} ${device.model || ""} - ${os.name} - ${browser.name}`,
    //   deviceName: "Unknow",
    //   expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    // })
    // await session.save()
    const { accessToken, refreshToken, role, accountAdmin } = result
    res.cookie('accessToken', accessToken, getCookieOptions('1h'))
    res.cookie('refreshToken', refreshToken, getCookieOptions('14d'))

    res.status(StatusCodes.OK).json({ 
      code: 200, 
      message: 'Đăng nhập thành công!', 
      accountAdmin,
      role
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    // const session = await Session.findOne({
    //   accountId: new mongoose.Types.ObjectId(refreshTokenDecoded.accountId),
    //   refreshTokenHash: hashToken(refreshToken)
    // })

    // if (!session) {
    //   res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh Token không hợp lệ' })
    //   return
    // }
    
    // // Xóa phiên cũ, tạo phiên mới + accessToken mới
    // await session.deleteOne()

    // const newRefreshToken = await JWTProvider.generateToken(
    //   payload,
    //   process.env.JWT_REFRESH_TOKEN_SECRET_ADMIN,
    //   '14 days'
    // )
    const result = await authService.refreshTokenAdmin(req.cookies.refreshToken)
    if (!result.success) {
      const statusCode = result.code === 401 ? StatusCodes.UNAUTHORIZED : StatusCodes.NOT_FOUND
      res.status(statusCode).json({ 
        code: result.code, 
        message: result.message
      })
      return
    }
    const { newAccessToken } = result

    res.cookie('accessToken', newAccessToken, getCookieOptions('1h'))
    res.status(StatusCodes.OK).json({ 
      code: 200,
      message: 'Làm mới accessToken thành công!' 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
// [DELETE] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('accessToken', getCookieOptions('1h'))
    res.clearCookie('refreshToken', getCookieOptions('14d'))

    res.status(StatusCodes.OK).json({ 
      code: 200, 
      message: "Đăng xuất thành công 1 thiết bị!" 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /auth/logout-all
export const logoutALL = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies?.accessToken
    if (!accessToken) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Không tồn tại accessToken' })
    const accessTokenDecoded = await JWTProvider.verifyToken(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN
    ) as {
      accountId: string,
      email: string,
      role_id: string
    }
    await Session.deleteMany({ accountId: accessTokenDecoded.accountId })

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
      })

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })  

    res.status(StatusCodes.OK).json({ message: 'Đăng xuất thành công tất cả thiết bị!' })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}