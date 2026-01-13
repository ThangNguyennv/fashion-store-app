import { z } from 'zod'

export const createArticleCategorySchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(100, 'Tiêu đề không được quá 100 ký tự')
    .transform((val) => val.replace(/\s+/g, ' ')),

  parent_id: z.string()
    .optional(),

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

export type CreateArticleCategoryFormData = z.infer<typeof createArticleCategorySchema>

export const editArticleCategorySchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(100, 'Tiêu đề không được quá 100 ký tự')
    .transform((val) => val.replace(/\s+/g, ' ')),

  parent_id: z.string()
    .optional(),

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

export type EditArticleCategoryFormData = z.infer<typeof editArticleCategorySchema>