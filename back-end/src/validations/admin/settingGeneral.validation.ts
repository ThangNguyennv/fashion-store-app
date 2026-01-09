import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

export const editSettingGeneral = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    websiteName: Joi.string()
      .trim()
      .required()
      .min(1)
      .max(50)
      .messages({
        "any.required": "Tên website là bắt buộc!",
        "string.empty": "Vui lòng nhập tên website!",
        "string.max": "Tên website không được vượt quá 50 ký tự!"
      }),
    
    email: Joi.string()
      .trim()
      .required()
      .min(1)
      .email()
      .lowercase()
      .messages({
        "any.required": "Email là bắt buộc!",
        "string.empty": "Vui lòng nhập email!",
        "string.email": "Email không đúng định dạng!",
      }),
    
    phone: Joi.string()
      .trim()
      .required()
      .min(1)
      .pattern(/^(0[35789]\d{8}|\+84[35789]\d{8})$/)
      .messages({
        "any.required": "Số điện thoại là bắt buộc!",
        "string.empty": "Vui lòng nhập số điện thoại!",
        "string.pattern.base": "Số điện thoại phải có 10 số và bắt đầu bằng 03/05/07/08/09 hoặc +84!"
      }),
    
    address: Joi.string()
      .trim()
      .required()
      .min(1)
      .messages({
        "any.required": "Địa chỉ là bắt buộc!",
        "string.empty": "Vui lòng nhập địa chỉ!"
      }),

    copyright: Joi.string()
      .trim()
      .required()
      .min(1)
      .messages({
        "any.required": "Thông tin bản quyền là bắt buộc!",
        "string.empty": "Vui lòng nhập thông tin bản quyền!",
      }),

    logo: Joi.string()
      .trim()
      .optional()
      .allow('')
      .uri()
      .messages({
        "string.uri": "URL logo không hợp lệ!"
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