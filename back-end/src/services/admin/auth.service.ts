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
    return { 
      success: false, 
      code: 401, 
      message: 'Tài khoản hoặc mật khẩu không chính xác!' 
    }
  }

  const isMatch = await bcrypt.compare(password, accountAdmin.password)

  if (!isMatch) {
    return { 
      success: false, 
      code: 401 ,
      message: 'Tài khoản hoặc mật khẩu không chính xác!' 
    }
  }

  if (accountAdmin.status === 'INACTIVE') {
    return { 
      success: false, 
      code: 403, 
      message: 'Tài khoản đã bị khóa!' 
    }
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
  const role = await Role.findOne({ 
    _id: accountAdmin.role_id, 
    deleted: false 
  }).lean()

  const accountData = accountAdmin.toObject()
  delete accountData.password

  return {
    success: true,
    accessToken,
    refreshToken,
    role,
    accountAdmin: accountData,
  }
}

export const refreshTokenAdmin = async (refreshToken: string) => {
  if (!refreshToken) {
    return { 
      success: false, 
      code: 401, 
      message: 'Không tồn tại refreshToken!' 
    }
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
    return { 
      success: false, 
      code: 404, 
      message: 'Tài khoản không tồn tại!' 
    }
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
  return {
    success: true,
    newAccessToken
  }
}