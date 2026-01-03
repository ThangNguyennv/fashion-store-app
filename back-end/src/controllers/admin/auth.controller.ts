import Account from '~/models/account.model'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt' 
import { JWTProvider } from '~/providers/jwt.provider'
import ms from 'ms'
import { StatusCodes } from 'http-status-codes'
import Session from '~/models/session.model'
import crypto from 'crypto'
import { getCookieOptions } from '~/utils/constants'
import Role from '~/models/role.model'

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const accountAdmin = await Account.findOne({
      email: email,
      deleted: false
    }).select('+password')
    if (!accountAdmin) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }

    const isMatch = await bcrypt.compare(password, accountAdmin.password)
    if (!isMatch) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }

    if (accountAdmin.status === 'INACTIVE') {
      res.json({
        code: 403,
        message: 'Tài khoản đã bị khóa!'
      })
      return
    }

    const payload = {
      accountId: accountAdmin._id,
      email: accountAdmin.email,
      role_id: accountAdmin.role_id 
    }

    const accessToken = await JWTProvider.generateToken(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN, 
      '1h'
    )

    const refreshToken = await JWTProvider.generateToken(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET_ADMIN,
      '14d'
    )
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

    res.cookie('accessToken', accessToken, getCookieOptions('14 days'))
    res.cookie('refreshToken', refreshToken, getCookieOptions('14 days'))
    const role = await Role.findOne({ _id: accountAdmin.role_id, deleted: false })
    res.json({ 
      code: 200, 
      message: 'Đăng nhập thành công!', 
      accountAdmin: accountAdmin,
      role: role
    })

  } catch (error) {
    res.json({
      code: 400,
      error: error
    })
  }
}

// [POST] /admin/auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken

  if (!refreshToken) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Không tồn tại refreshToken!' })
    return
  }
  try {
    const refreshTokenDecoded = await JWTProvider.verifyToken(
      refreshToken, 
      process.env.JWT_REFRESH_TOKEN_SECRET_ADMIN
    ) as {
      accountId: string,
      email: string,
      role_id: string
    }
    const account = await Account.findOne({
      _id: refreshTokenDecoded.accountId,
      deleted: false,
      status: "ACTIVE"
    })
    if (!account) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Account không tồn tại!' })
      return
    }
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

    const payload = { 
      accountId: refreshTokenDecoded.accountId, 
      email: refreshTokenDecoded.email, 
      role_id: refreshTokenDecoded.role_id, 
    }

    const newAccessToken = await JWTProvider.generateToken(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN,
      '1h'
    )

    // const newRefreshToken = await JWTProvider.generateToken(
    //   payload,
    //   process.env.JWT_REFRESH_TOKEN_SECRET_ADMIN,
    //   '14 days'
    // )
    // console.log("🚀 ~ auth.controller.ts ~ refreshToken ~ newRefreshToken:", newRefreshToken);

    res.cookie('accessToken', newAccessToken, getCookieOptions('14 days'))

    // res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   maxAge: ms('14 days'),
    //   path: '/'
    // })

    res.status(StatusCodes.OK).json({ message: 'Làm mới accessToken thành công!' })
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json( {message: 'RefreshToken invalid!'} )
  }
}
// [DELETE] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('accessToken', getCookieOptions('14 days'))
    res.clearCookie('refreshToken', getCookieOptions('14 days'))

    res.json({ code: 200, message: "Đăng xuất thành công 1 thiết bị!" })
  } catch (error) {
    res.json({
      code: 400,
      error: error
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