import { z } from 'zod'

export const roleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Tiêu đề không được để trống!')
    .max(100, 'Tiêu đề không được quá 100 ký tự'),

  titleId: z
    .string()
    .trim()
    .min(1, 'Tiêu đề không được để trống!')
    .max(50, 'Mã định danh không được quá 50 ký tự'),

  description: z.string().optional()
})

export type RoleFormData = z.infer<typeof roleSchema>

export const editRoleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Tiêu đề không được để trống!')
    .max(100, 'Tiêu đề không được quá 100 ký tự'),
  titleId: z
    .string()
    .trim()
    .min(1, 'Mã định danh không được để trống!')
    .max(50, 'Mã định danh không được quá 50 ký tự'),
  description: z.string().optional()
})

export type EditRoleFormData = z.infer<typeof editRoleSchema>