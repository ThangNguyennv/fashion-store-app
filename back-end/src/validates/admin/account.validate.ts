import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

export const createPost = (
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
        "any.required": 'Họ tên là bắt buộc!',
        "string.empty": "Vui lòng nhập họ tên!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!"
      }),
    email: Joi.string()
      .trim()
      .required()
      .min(1)
      .email()
      .lowercase()
      .trim()
      .messages({
        "any.required": "Email là bắt buộc!",
        "string.empty": "Vui lòng nhập email của bạn!",
        "string.email": "Email không đúng định dạng!"
      }),
    password: Joi.string()
      .trim()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .messages({
        "any.required": "Mật khẩu là bắt buộc!",
        "string.empty": "Vui lòng nhập mật khẩu!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "string.pattern.base": "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*?&)!"
      }),
    phone: Joi.string()
      .trim()
      .required()
      .min(1)
      .pattern(/^(0[35789]\d{8}|\+84[35789]\d{8})$/)
      .messages({
        "any.required": "Số điện thoại là bắt buộc!",
        "string.empty": "Vui lòng nhập số điện thoại của bạn!",
        "string.pattern.base": "Số điện thoại phải có 10 số và bắt đầu bằng 03/05/07/08/09 hoặc +84!"
      }),
    role_id: Joi.string()
      .required()
      .messages({
        'string.empty': 'Vui lòng chọn phân quyền!',
        'any.required': 'Phân quyền là bắt buộc!'
      }),

    status: Joi.string()
      .valid('ACTIVE', 'INACTIVE')
      .required()
      .messages({
        'any.only': 'Trạng thái phải là ACTIVE hoặc INACTIVE!',
        'any.required': 'Trạng thái là bắt buộc!'
      }),
      
    avatar: Joi.string()
      .optional()
      .allow('')
      .uri()
      .messages({
        "string.uri": "URL avatar không hợp lệ!"
      })
    })

  const { error, value  } = schema.validate(req.body, {
    abortEarly: false,      // Hiển thị tất cả lỗi
    stripUnknown: true,     // Loại bỏ trường không có trong schema (Chống hacker gửi linh tinh lên)
    convert: true           // Chuyển đổi kiểu dữ liệu (Form HTML thường gửi data dạng STRING)
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
  req.body = value
  next()
}


export const editPatch = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    fullName: Joi.string()
      .required()
      .max(50)
      .trim()
      .messages({
        "string.empty": "Vui lòng nhập họ tên!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!",
        "any.required": "Họ tên là bắt buộc!"
      }),
    
    email: Joi.string()
      .required()
      .email()
      .lowercase()
      .trim()
      .messages({
        "string.empty": "Vui lòng nhập email của bạn!",
        "string.email": "Email không đúng định dạng!",
        "any.required": "Email là bắt buộc!"
      }),
    
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
    // - 0xxxxxxxxx (10 số)
    phone: Joi.string()
      .trim()
      .optional()
      .allow('')
      .pattern(/^0\d{9,10}$/)
      .messages({
        "string.pattern.base": "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số!"
      }),
    
    role_id: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng chọn phân quyền!",
        "any.required": "Phân quyền là bắt buộc!"
      }),
    
    status: Joi.string()
      .valid('ACTIVE', 'INACTIVE')
      .required()
      .messages({
        "any.only": "Trạng thái phải là ACTIVE hoặc INACTIVE!",
        "any.required": "Trạng thái là bắt buộc!"
      }),
    avatar: Joi.string()
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