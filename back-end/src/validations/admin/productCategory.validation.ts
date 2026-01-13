import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

const createProductCategorySchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Tiêu đề không được để trống!',
      'any.required': 'Tiêu đề là bắt buộc!',
      'string.max': 'Tiêu đề không được quá 100 ký tự!'
    }),

  parent_id: Joi.string()
    .trim()
    .optional()
    .allow(''),

  description: Joi.string()
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

const editProductCategorySchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Tiêu đề không được để trống!',
      'any.required': 'Tiêu đề là bắt buộc!',
      'string.max': 'Tiêu đề không được quá 100 ký tự!'
    }),

  parent_id: Joi.string()
    .trim()
    .optional()
    .allow(''),

  description: Joi.string()
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

export const createProductCategory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { error, value } = createProductCategorySchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
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

    // Thumbnail bắt buộc khi tạo mới
    if (!req.file) {
      res.json({
        code: 400,
        message: 'Vui lòng chọn ảnh đại diện'
      })
      return
    }

    const file = req.file

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      res.json({
        code: 400,
        message: 'Kích thước ảnh không được vượt quá 5MB'
      })
      return
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ]

    if (!allowedTypes.includes(file.mimetype)) {
      res.json({
        code: 400,
        message: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'
      })
      return
    }

    req.body = value
    next()
  } catch (err) {
    res.json({
      code: 500,
      message: 'Lỗi validate dữ liệu'
    })
  }
}

export const editProductCategory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { error, value } = editProductCategorySchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
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
      const file = req.file

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        res.json({
          code: 400,
          message: 'Kích thước ảnh không được vượt quá 5MB'
        })
        return
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ]

      if (!allowedTypes.includes(file.mimetype)) {
        res.json({
          code: 400,
          message: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'
        })
        return
      }
    }

    req.body = value
    next()
  } catch (err) {
    res.json({
      code: 500,
      message: 'Lỗi validate dữ liệu'
    })
  }
}