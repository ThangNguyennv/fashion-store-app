import { Request, Response, NextFunction } from 'express'
import Joi from "joi"

export const registerPost = (
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
        "any.required": "Họ và tên là bắt buộc!",
        "string.empty": "Họ và tên không được để trống!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!"
      }),
    email: Joi.string()
      .trim()
      .required()
      .email()
      .lowercase()
      .messages({
        "any.required": "Email là bắt buộc!",
        "string.empty": "Email không được để trống!",
        "string.email": "Email không đúng định dạng!"
      }),
    password: Joi.string()
      .trim()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .messages({
        "any.required": "Mật khẩu là bắt buộc!",
        "string.empty": "Mật khẩu không được để trống!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "string.pattern.base": "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*?&)!"
      }),
    confirmPassword: Joi.string()
      .trim()
      .required()
      .min(8)
      .valid(Joi.ref('password'))
      .messages({
        "any.required": "Xác nhận mật khẩu là bắt buộc!",
        "string.empty": "Xác nhận mật khẩu không được để trống!",
        "any.only": "Mật khẩu xác nhận không khớp!"
      }),
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

export const loginPost = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .required()
      .min(1)
      .email()
      .lowercase()
      .messages({
        "any.required": "Email là bắt buộc!",
        "string.empty": "Email không được để trống!",
        "string.email": "Email không đúng định dạng!"
      }),
    
    password: Joi.string()
      .required()
      .min(8)
      .messages({
        "any.required": "Mật khẩu là bắt buộc!",
        "string.empty": "Mật khẩu không được để trống!"
      })
  })

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
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

export const forgotPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .required()
      .min(1)
      .email()
      .lowercase()
      .messages({
        "any.required": "Email là bắt buộc!",
        "string.empty": "Email không được để trống!",
        "string.email": "Email không đúng định dạng!"
      })
  })
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
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

export const otpPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.otp) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mã OTP!'
    })
    return
  }
  next()
}

export const resetPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    password: Joi.string()
      .trim()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .messages({
        "any.required": "Mật khẩu là bắt buộc!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "string.pattern.base": "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*?&)!"
      }),
    confirmPassword: Joi.string()
      .trim()
      .required()
      .min(8)
      .valid(Joi.ref('password'))
      .messages({
        "any.required": "Xác nhận mật khẩu là bắt buộc!",
        "string.empty": "Xác nhận mật khẩu không được để trống!",
        "any.only": "Mật khẩu xác nhận không khớp!"
      }),
    resetToken: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": "resetToken là bắt buộc!",
        "string.empty": "resetToken không được để trống!",
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

export const editPatch = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .trim()
      .required()
      .min(1)
      .max(50)
      .messages({
        "any.required": "Họ và tên là bắt buộc!",
        "string.empty": "Họ và tên không được để trống!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!"
      }),
    email: Joi.string()
      .trim()
      .required()
      .email()
      .lowercase()
      .messages({
        "any.required": "Email là bắt buộc!",
        "string.empty": "Email không được để trống!",
        "string.email": "Email không đúng định dạng!"
      }),
    phone: Joi.string()
      .trim()
      .optional() // Cho phép không gửi trường password lên
      .allow('', null) // Cho phép gửi trường password lên là: '' hoặc null
      .when(Joi.string().trim().min(1), { // Nhảy vào đây chỉ khi nhập mật khẩu
        then: Joi.string()
          .pattern(/^(0[35789]\d{8}|\+84[35789]\d{8})$/)
          .messages({
            "any.required": "Số điện thoại là bắt buộc",
            "string.empty": "Vui lòng nhập số điện thoại!",
            "string.pattern.base": "Số điện thoại phải có 10 số và bắt đầu bằng 03/05/07/08/09 hoặc +84!"
          }),
      }),
    address: Joi.string()
      .trim()
      .allow('') // Cho phép chuỗi rỗng
      .optional() 
      .messages({
        'string.base': 'Địa chỉ phải là chuỗi ký tự'
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

export const changePasswordPatch = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .trim()
      .required()
      .messages({
        'string.empty': 'Mật khẩu hiện tại không được để trống!',
        'any.required': 'Mật khẩu hiện tại là bắt buộc!'
      }),
    password: Joi.string()
      .trim()
      .required()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .messages({
        "any.required": "Mật khẩu là bắt buộc!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "string.pattern.base": "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*?&)!"
      }),
    confirmPassword: Joi.string()
      .trim()
      .required()
      .min(8)
      .valid(Joi.ref('password'))
      .messages({
        "any.required": "Xác nhận mật khẩu là bắt buộc!",
        "string.empty": "Xác nhận mật khẩu không được để trống!",
        "any.only": "Mật khẩu xác nhận không khớp!"
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
