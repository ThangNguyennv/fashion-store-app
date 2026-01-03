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
  if (!req.body.fullName) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập họ tên!'
    })
    return
  }

  if (!req.body.email) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập email!'
    })
    return
  }
  next()
}

export const changePasswordPatch = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.currentPassword) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mật khẩu hiện tại!'
    })
    return
  }
  if (!req.body.password) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mật khẩu mới!'
    })
    return
  }
  if (!req.body.confirmPassword) {
    res.json({
      code: 400,
      message: 'Vui lòng xác nhận nhập mật khẩu!'
    })
    return
  }
  if (req.body.password != req.body.confirmPassword) {
    res.json({
      code: 400,
      message: 'Mật khẩu không khớp, vui lòng nhập lại!'
    })
    return
  }
  next()
}
