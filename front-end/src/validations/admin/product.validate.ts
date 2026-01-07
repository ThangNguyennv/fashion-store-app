import { z } from 'zod'

export const productSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(50, 'Họ và tên không được quá 50 ký tự!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  product_category_id: z.string()
    .min(1, 'Vui lòng chọn danh mục sản phẩm'),

  featured: z.enum(['1', '0'], {
    message: 'Đặc trưng không hợp lệ!'
  }),

  description: z.string()
    .trim()
    .optional(),

  price: z.number()
    .min(0, 'Giá phải lớn hơn hoặc bằng 0')
    .optional(),

  discountPercentage: z.number()
    .min(0, '% Giảm giá phải lớn hơn hoặc bằng 0')
    .max(100, '% Giảm giá không được vượt quá 100')
    .optional(),

  stock: z.number()
    .min(1, 'Số lượng phải ít nhất là 1'),

  colors: z.array(
    z.object({
      name: z.string(),
      code: z.string(),
      images: z.array(z.any())
    })
  ).min(1, 'Vui lòng chọn ít nhất 1 màu'),

  sizes: z.array(
    z.string().min(1, 'Size không được rỗng')
  ).min(1, 'Vui lòng chọn ít nhất 1 kích cỡ'),

  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái không hợp lệ!'
  }),

  thumbnail: z.any()
    .refine((val) => val !== null && val !== '', 'Vui lòng chọn ảnh đại diện')
})

export type ProductFormData = z.infer<typeof productSchema>


export const editProductSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(50, 'Tiêu đề không được quá 50 ký tự!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  product_category_id: z.string()
    .min(1, 'Vui lòng chọn danh mục sản phẩm'),

  featured: z.enum(['1', '0'], {
    message: 'Đặc trưng không hợp lệ!'
  }),

  description: z.string()
    .trim()
    .optional(),

  price: z.number()
    .min(0, 'Giá phải lớn hơn hoặc bằng 0')
    .optional(),

  discountPercentage: z.number()
    .min(0, '% Giảm giá phải lớn hơn hoặc bằng 0')
    .max(100, '% Giảm giá không được vượt quá 100')
    .optional(),

  stock: z.number()
    .min(1, 'Số lượng phải ít nhất là 1'),

  colors: z.array(
    z.object({
      name: z.string(),
      code: z.string(),
      images: z.array(z.any())
    })
  ).min(1, 'Vui lòng chọn ít nhất 1 màu'),

  sizes: z.array(
    z.string().min(1, 'Size không được rỗng')
  ).min(1, 'Vui lòng chọn ít nhất 1 kích cỡ'),

  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái không hợp lệ!'
  }),

  thumbnail: z.any()
    .refine((val) => val !== null && val !== '', 'Vui lòng chọn ảnh đại diện')
})

export type EditProductFormData = z.infer<typeof editProductSchema>