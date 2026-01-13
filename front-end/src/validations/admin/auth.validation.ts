import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Vui lòng nhập email của bạn!')
    .pipe(z.email('Email không hợp lệ')),
  password: z.string()
    .min(1, 'Vui lòng nhập mật khẩu!')
})

export type LoginFormData = z.infer<typeof loginSchema>