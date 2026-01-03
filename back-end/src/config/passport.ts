import passport, { use } from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '~/models/user.model'

// Cấu hình chiến lược Google OAuth2
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  
  // URL này phải khớp 100% với "Authorized redirect URI" bạn đã cấu hình
  // trên Google Cloud Console.
  // Đảm bảo biến 'API_ROOT' (ví dụ: http://localhost:3100) có trong file .env của backend.
  callbackURL: `${process.env.API_ROOT}/user/auth/google/callback`,
  
  passReqToCallback: false // Đặt là false, chúng ta không cần `req` trong callback
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // 1. Lấy thông tin cơ bản từ Google profile
    const googleId = profile.id
    const email = profile.emails?.[0].value
    const fullName = profile.displayName
    const avatar = profile.photos?.[0].value

    // Nếu Google không trả về email, đây là một lỗi
    if (!email) {
      return done(new Error('Không thể lấy email từ Google.'), false)
    }

    // 2. Tìm người dùng bằng Google ID
    let user = await User.findOne({ 
      $or: [{ googleId: googleId}, { email: email }],
      deleted: false 
    })

    // Nếu không có user thì tạo mới
    if (!user) {
      user = new User({
        googleId,
        email,
        fullName,
        avatar
      })
      await user.save()
    } else {
      // Nếu có rồi thì cập nhật googleId
      if (!user.googleId) {
        user.googleId = googleId
        user.avatar = user.avatar || avatar
        await user.save()
      }
    }
    // LUÔN TRẢ VỀ USER Ở ĐÂY để Passport cho phép đi tiếp vào Controller
    return done(null, user)
  } catch (error) {
    return done(error as Error, false)
  }
}
))

// Lưu ý: Chúng ta không cần serialize/deserialize User
// vì chúng ta đang dùng JWT (stateless).
// Passport chỉ dùng để xác thực một lần tại route callback.

