import Account from '~/models/account.model'
import bcrypt from 'bcrypt' 
import { JWTProvider } from '~/providers/jwt.provider'
import Role from '~/models/role.model'

export const loginAdmin = async (data: any) => {
  const { email, password } = data

    const accountAdmin = await Account.findOne({
      email: email,
      deleted: false
    }).select('+password')

    if (!accountAdmin) {
      const error: any = new Error('Tài khoản hoặc mật khẩu không chính xác!') 
      error.statusCode = 401
      throw error
    }

    const isMatch = await bcrypt.compare(password, accountAdmin.password)
    if (!isMatch) {
      const error: any = new Error('Tài khoản hoặc mật khẩu không chính xác!') 
      error.statusCode = 401
      throw error
  }

    if (accountAdmin.status === 'INACTIVE') {
      const error: any = new Error('Tài khoản đã bị khóa!') 
      error.statusCode = 403
      throw error
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
  const role = await Role.findOne({ _id: accountAdmin.role_id, deleted: false }).lean()
  return {
    accessToken,
    refreshToken,
    role,
    accountAdmin
  }
}

export const refreshTokenAdmin = async (refreshToken: string) => {
  if (!refreshToken) {
      const error: any = new Error('Không tồn tại refreshToken!')
      error.statusCode = 403
      throw error
  }
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
      const error: any = new Error('Account không tồn tại!')
      error.statusCode = 403
      throw error
  }
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
  return newAccessToken
}