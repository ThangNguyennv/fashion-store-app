import { z } from 'zod'

export const productCategorySchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(100, 'Tiêu đề không được quá 100 ký tự')
    .transform((val) => val.replace(/\s+/g, ' ')),

  parent_id: z.string().optional(),

  description: z.string()
    .trim()
    .optional(),

  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái không hợp lệ!'
  }),

  thumbnail: z.any()
    .refine((val) => val !== null && val !== '', 'Vui lòng chọn ảnh đại diện')
})

export type ProductCategoryFormData = z.infer<typeof productCategorySchema>

export const editProductCategorySchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(100, 'Tiêu đề không được quá 100 ký tự')
    .transform((val) => val.replace(/\s+/g, ' ')),

  parent_id: z.string().optional(),

  description: z.string()
    .trim()
    .optional(),

  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái không hợp lệ!'
  }),

  thumbnail: z.any()
    .refine((val) => val !== null && val !== '', 'Vui lòng chọn ảnh đại diện')
})

export type EditProductCategoryFormData = z.infer<typeof editProductCategorySchema>