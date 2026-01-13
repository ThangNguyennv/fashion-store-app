import { Server, Socket } from 'socket.io'
import * as cookie from 'cookie'
import { JWTProvider } from '~/providers/jwt.provider'

export const chatSocket = (io: Server) => {
  io.use(async (socket: Socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie
      if (!cookies) {
        return next(new Error('Authentication error: No cookies found.'))
      }

      const parsedCookies = cookie.parse(cookies)
      const tokenAdmin = parsedCookies.accessToken
      const tokenUser = parsedCookies.accessTokenUser

      if (tokenAdmin) {
        // Xác thực Admin (Account)
        const decoded = await JWTProvider.verifyToken(
          tokenAdmin, 
          process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN
        ) as {
          accountId: string, 
          role_id: string
        }
        if (!decoded.accountId) {
          return next(new Error('Authentication error: Invalid admin token.'))
        }
        // Gán thông tin vào socket để dùng sau
        socket.data.adminId = decoded.accountId
        socket.data.role = 'admin'
        return next()
      } else if (tokenUser) {
        // Xác thực Client (User)
        const decoded = await JWTProvider.verifyToken(
          tokenUser,
          process.env.JWT_ACCESS_TOKEN_SECRET_CLIENT
        ) as {
          userId: string
        }
        if (!decoded.userId) {
          return next(new Error('Authentication error: Invalid user token.'))
        }
        // Gán thông tin vào socket để dùng sau
        socket.data.userId = decoded.userId
        socket.data.role = 'user'
        return next()
      } else {
        return next(new Error('Authentication error: No token provided.'))
      }
    } catch (error) {
        console.error('Socket Auth Error:', error.message)
        return next(new Error('Authentication error: ' + error.message))
    }
  })
}