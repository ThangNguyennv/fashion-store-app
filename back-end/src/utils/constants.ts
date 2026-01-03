import ms, { StringValue } from 'ms'

const isProduction = process.env.NODE_ENV === 'production'

export const getCookieOptions = (duration: StringValue = '14 days') => ({
  httpOnly: true, // Chống XSS
  secure: isProduction, // Chỉ bật True khi là HTTPS (Production)
  sameSite: isProduction ? ('none' as const) : ('lax' as const), // 'none' cho HTTPS, 'lax' cho localhost
  maxAge: ms(duration)
})