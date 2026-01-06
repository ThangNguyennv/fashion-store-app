import rateLimit from "express-rate-limit"

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true, // Trả về header chuẩn: RateLimit-*
  legacyHeaders: false, // Tắt header cũ: X-RateLimit-*

  handler: (req, res) => {
    res.status(429).json({
      statusCode: 429,
      message: 'Bạn đã thử quá nhiều lần. Vui lòng quay lại sau 1 phút!'
    })
  }
})
