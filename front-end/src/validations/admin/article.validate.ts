import { z } from 'zod'

export const createArticleSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(200, 'Tiêu đề không được quá 200 ký tự')
    .transform((val) => val.replace(/\s+/g, ' ')),

  article_category_id: z.string()
    .min(1, 'Vui lòng chọn danh mục'),

  featured: z.enum(['1', '0'], {
    message: 'Giá trị nổi bật không hợp lệ!'
  }),

  descriptionShort: z.string()
    .trim()
    .optional(),

  descriptionDetail: z.string()
    .trim()
    .optional(),

  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái không hợp lệ!'
  }),

  thumbnail: z.any()
    .refine((val) => val !== null && val !== '', 'Vui lòng chọn ảnh đại diện')
})

export type CreateArticleFormData = z.infer<typeof createArticleSchema>

export const editArticleSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(200, 'Tiêu đề không được quá 200 ký tự')
    .transform((val) => val.replace(/\s+/g, ' ')),

  article_category_id: z.string()
    .min(1, 'Vui lòng chọn danh mục'),

  featured: z.enum(['1', '0'], {
    message: 'Giá trị nổi bật không hợp lệ!'
  }),

  descriptionShort: z.string()
    .trim()
    .optional(),

  descriptionDetail: z.string()
    .trim()
    .optional(),

  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái không hợp lệ!'
  }),

  thumbnail: z.any()
    .refine((val) => val !== null && val !== '', 'Vui lòng chọn ảnh đại diện')
})

export type EditArticleFormData = z.infer<typeof editArticleSchema>