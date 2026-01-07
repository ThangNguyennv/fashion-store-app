import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

export const createPost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
   const schema =  Joi.object({
    title: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
        'string.base': 'Tiêu đề phải là chuỗi!',
        'string.empty': 'Tiêu đề không được để trống!',
        'string.max': 'Tiêu đề không được quá 100 ký tự!',
        'any.required': 'Tiêu đề là bắt buộc!'
        }),

    titleId: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .messages({
        'string.base': 'Mã định danh phải là chuỗi!',
        'string.empty': 'Mã định danh không được để trống!',
        'string.max': 'Mã định danh không được quá 50 ký tự!',
        'any.required': 'Mã định danh là bắt buộc!'
        }),

    description: Joi.string()
        .allow('')
        .optional()
        
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

export const editPost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    // Validate các trường tương tự Create
    title: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Tiêu đề không được để trống',
        'string.max': 'Tiêu đề không được quá 100 ký tự',
        'any.required': 'Tiêu đề là bắt buộc'
      }),

    titleId: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Mã định danh không được để trống',
        'string.max': 'Mã định danh không được quá 50 ký tự',
        'any.required': 'Mã định danh là bắt buộc'
      }),

    description: Joi.string()
      .allow('')
      .optional()
  })

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true, // Loại bỏ các trường thừa như _id, createdAt từ client gửi lên
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