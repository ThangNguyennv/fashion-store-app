import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

export const createPost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .required()
      .min(1)
      .max(200)
      .messages({
        'any.required': 'Tiêu đề là bắt buộc!',
        'string.empty': 'Tiêu đề không được để trống!',
        'string.max': 'Tiêu đề không được quá 200 ký tự!'
      }),

    article_category_id: Joi.string()
      .trim()
      .required()
      .min(1)
      .messages({
        'any.required': 'Danh mục là bắt buộc!',
        'string.empty': 'Danh mục không được để trống!'
      }),

    featured: Joi.string()
      .trim()
      .valid('1', '0')
      .required()
      .messages({
        'any.only': 'Giá trị nổi bật không hợp lệ!',
        'any.required': 'Nổi bật là bắt buộc!'
      }),

    descriptionShort: Joi.string()
      .trim()
      .optional()
      .allow(''),

    descriptionDetail: Joi.string()
      .trim()
      .optional()
      .allow(''),

    status: Joi.string()
      .valid('ACTIVE', 'INACTIVE')
      .required()
      .messages({
        'any.only': 'Trạng thái không hợp lệ!',
        'any.required': 'Trạng thái là bắt buộc!'
      }),

    thumbnail: Joi.any()
      .required()
      .invalid(null, '')
      .messages({
        'any.invalid': 'Ảnh đại diện không hợp lệ!',
        'any.required': 'Ảnh đại diện là bắt buộc!'
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

  // Validate file ảnh
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

export const editPatch = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .required()
      .min(1)
      .max(200)
      .messages({
        'any.required': 'Tiêu đề là bắt buộc!',
        'string.empty': 'Tiêu đề là bắt buộc!',
        'string.max': 'Tiêu đề không được quá 200 ký tự!'
      }),

    article_category_id: Joi.string()
      .trim()
      .required()
      .min(1)
      .messages({
        'any.required': 'Vui lòng chọn danh mục!',
        'string.empty': 'Vui lòng chọn danh mục!'
      }),

    featured: Joi.string()
      .trim()
      .valid('1', '0')
      .required()
      .messages({
        'any.only': 'Giá trị nổi bật không hợp lệ!',
        'any.required': 'Nổi bật là bắt buộc!'
      }),

    descriptionShort: Joi.string()
      .trim()
      .optional()
      .allow(''),

    descriptionDetail: Joi.string()
      .trim()
      .optional()
      .allow(''),

    status: Joi.string()
      .valid('ACTIVE', 'INACTIVE')
      .required()
      .messages({
        'any.only': 'Trạng thái không hợp lệ!',
        'any.required': 'Trạng thái là bắt buộc!'
      }),

    thumbnail: Joi.any()
      .required()
      .invalid(null, '')
      .messages({
        'any.invalid': 'Vui lòng chọn ảnh đại diện!',
        'any.required': 'Vui lòng chọn ảnh đại diện!'
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

  // Validate file ảnh nếu có upload mới
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