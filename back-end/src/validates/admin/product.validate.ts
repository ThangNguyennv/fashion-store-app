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
      .max(50)
      .messages({
        "any.required": "Tiêu đề là bắt buộc!", // Không gửi gì lên -> Lỗi
        "string.empty": "Tiêu đề không được để trống!", // có gửi lên chuỗi rỗng -> Lỗi
        "string.max": "Tiêu đề không được vượt quá 50 ký tự!",
      }),
    product_category_id: Joi.string()
      .trim()
      .required()
      .min(1)
      .messages({
        "any.required": "Danh mục sản phẩm là bắt buộc!", // Không gửi gì lên -> Lỗi
        "string.empty": "Danh mục sản phẩm không được để trống!", // có gửi lên chuỗi rỗng -> Lỗi
      }),

    featured: Joi.string()
      .trim()
      .valid('1', '0')
      .required()
      .messages({
        'any.only': 'Nổi bật phải là 1 hoặc 0!',
        'any.required': 'Nổi bật là bắt buộc!'
      }),

    description: Joi.string()
      .trim()
      .optional()
      .allow(''),
    
    price: Joi.number()
      .required()
      .min(0)
      .messages({
        'number.min': 'Giá phải lớn hơn hoặc bằng 0!'
      }),
    
    discountPercentage: Joi.number()
      .required()
      .min(0)
      .max(100)
      .messages({
        'number.min': '% Giảm giá phải lớn hơn hoặc bằng 0!',
        'number.max': '% Giảm giá không được vượt quá 100!'
      }),
    
    stock: Joi.number()
      .required()
      .min(1)
      .messages({
        'number.min': 'Số lượng phải lớn hơn hoặc bằng 1!'
      }),
    
    colors: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          code: Joi.string().required(),
          images: Joi.array().items(Joi.any().required())
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Vui lòng chọn ít nhất 1 màu!',
        'any.required': 'Màu sắc là bắt buộc!'
      }),
    
    sizes: Joi.array()
      .items(
        Joi.string()
          .min(1)
          .messages({
            'string.min': 'Size không được rỗng!',
            'string.empty': 'Size không được rỗng!'
          })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Vui lòng chọn ít nhất 1 kích cỡ!',
        'array.required': 'Kích cỡ là bắt buộc!'
      }),

    status: Joi.string()
      .valid('ACTIVE', 'INACTIVE')
      .required()
      .messages({
        'any.only': 'Trạng thái phải là ACTIVE hoặc INACTIVE!',
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
      .max(50)
      .messages({
        "any.required": "Tiêu đề là bắt buộc!",
        "string.empty": "Tiêu đề là bắt buộc!",
        "string.max": "Tiêu đề không được quá 50 ký tự!",
      }),
    
    product_category_id: Joi.string()
      .trim()
      .required()
      .min(1)
      .messages({
        "any.required": "Vui lòng chọn danh mục sản phẩm!",
        "string.empty": "Vui lòng chọn danh mục sản phẩm!",
      }),

    featured: Joi.string()
      .trim()
      .valid('1', '0')
      .required()
      .messages({
        'any.only': 'Đặc trưng không hợp lệ!',
        'any.required': 'Đặc trưng là bắt buộc!'
      }),

    description: Joi.string()
      .trim()
      .optional()
      .allow(''),
    
    price: Joi.number()
      .optional()
      .min(0)
      .messages({
        'number.min': 'Giá phải lớn hơn hoặc bằng 0!'
      }),
    
    discountPercentage: Joi.number()
      .optional()
      .min(0)
      .max(100)
      .messages({
        'number.min': '% Giảm giá phải lớn hơn hoặc bằng 0!',
        'number.max': '% Giảm giá không được vượt quá 100!'
      }),
    
    stock: Joi.number()
      .required()
      .min(1)
      .messages({
        'number.min': 'Số lượng phải ít nhất là 1!',
        'any.required': 'Số lượng là bắt buộc!'
      }),
    
    colors: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          code: Joi.string().required(),
          images: Joi.array().items(Joi.any().required())
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Vui lòng chọn ít nhất 1 màu!',
        'any.required': 'Màu sắc là bắt buộc!'
      }),
    
    sizes: Joi.array()
      .items(
        Joi.string()
          .min(1)
          .messages({
            'string.min': 'Size không được rỗng!',
            'string.empty': 'Size không được rỗng!'
          })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Vui lòng chọn ít nhất 1 kích cỡ!',
        'any.required': 'Kích cỡ là bắt buộc!'
      }),

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
