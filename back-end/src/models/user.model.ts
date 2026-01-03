import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true // Email phải là duy nhất
    },
    address: String,
    password: {
      type: String,
      required: false, // Bắt buộc là false để cho phép OAuth
      select: false // Rất quan trọng: Không bao giờ trả về trường này
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // Cho phép nhiều document không có trường này
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: 'ACTIVE'
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema, 'users')

export default User

