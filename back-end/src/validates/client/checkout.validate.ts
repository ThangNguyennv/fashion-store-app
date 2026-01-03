import { Request, Response, NextFunction } from 'express'
import Joi from "joi"

export const orderPost = (
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
    address: Joi.string()
        .trim()
        .required()
        .min(1)
        .messages({
        "any.required": "Địa chỉ là bắt buộc!",
        "string.empty": "Vui lòng nhập địa chỉ của bạn!",
        'string.base': 'Địa chỉ phải là chuỗi ký tự'
        }),
    note: Joi.string()
      .trim()
      .allow('')
      .optional(),

    paymentMethod: Joi.string()
      .valid('COD', 'MOMO', 'VNPAY', 'ZALOPAY')
      .required()
      .messages({
        'any.only': 'Phương thức thanh toán không hợp lệ!',
        'any.required': 'Phương thức thanh toán là bắt buộc!'
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