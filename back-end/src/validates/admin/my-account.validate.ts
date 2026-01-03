import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

export const editPatch = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    fullName: Joi.string()
      .trim()
      .required()
      .min(1)
      .max(50)
      .messages({
        "any.required": "Họ tên là bắt buộc!", // Không gửi gì lên -> Lỗi
        "string.empty": "Vui lòng nhập họ tên!", // có gửi lên chuỗi rỗng -> Lỗi
        "string.max": "Họ tên không được vượt quá 50 ký tự!",
      }),
    
    email: Joi.string()
      .trim()
      .required()
      .min(1)
      .email()
      .lowercase()
      .messages({
        "any.required": "Họ tên là bắt buộc!", // Không gửi gì lên -> Lỗi
        "string.empty": "Vui lòng nhập email của bạn!",
        "string.email": "Email không đúng định dạng!",
      }),
    
    // Cho phép rỗng, nhưng nếu nhập thì phải >= 8 ký tự
    password: Joi.string()
      .trim()
      .optional() // Cho phép không gửi trường password lên
      .allow('', null) // Cho phép gửi trường password lên là: '' hoặc null
      .when(Joi.string().trim().min(1), { // Nhảy vào đây chỉ khi nhập mật khẩu
        then: Joi.string()
          .min(8)
          .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
          .messages({
            "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
            "string.pattern.base":
              "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*?&)!"
          }),
      }),
    
    // Số điện thoại VN chuẩn:
    phone: Joi.string()
      .trim()
      .required()
      .min(1)
      .pattern(/^(0[35789]\d{8}|\+84[35789]\d{8})$/)
      .messages({
        "any.required": "Số điện thoại là bắt buộc",
        "string.empty": "Số điện thoại không được để trống!",
        "string.pattern.base": "Số điện thoại phải có 10 số và bắt đầu bằng 03/05/07/08/09 hoặc +84!"
      }),

    avatar: Joi.string()
      .trim()
      .optional()
      .allow('')
      .uri()
      .messages({
        "string.uri": "URL avatar không hợp lệ!"
      })
  })

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,      // Hiển thị tất cả lỗi
    stripUnknown: true,     // Loại bỏ trường không có trong schema
    convert: true           // Chuyển đổi kiểu dữ liệu
  })

  if (error) {
    const errors = error.details.map(detail => detail.message)
    res.json({
      code: 400,
      message: errors[0],
      errors
    })
    return
  }

  // Validate avatar file nếu có upload
  if (req.file) {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      res.json({
        code: 400,
        message: 'File ảnh không hợp lệ. Chỉ chấp nhận: JPG, PNG, GIF, WebP',
        errors: ['File ảnh không hợp lệ']
      })
      return
    }

    if (req.file.size > maxSize) {
      res.json({
        code: 400,
        message: 'Kích thước ảnh không được vượt quá 5MB',
        errors: ['Kích thước ảnh quá lớn']
      })
      return
    }
  }

  req.body = value
  next()
}