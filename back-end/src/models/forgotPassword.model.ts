import mongoose from 'mongoose'

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    // Thuộc tính tự có trong mongoose (Thời gian hiện tại + 10 giây)
    expireAt: {
      type: Date,
      expires: 600
    }
  },
  {
    timestamps: true
  }
)

const ForgotPassword = mongoose.model(
  'ForgotPassword',
  forgotPasswordSchema,
  'forgot-password'
)

export default ForgotPassword
