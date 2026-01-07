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

export const forgotPasswordSchema = z.object({
  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Vui lòng nhập email của bạn!')
    .pipe(z.email('Email không đúng định dạng!'))
})

export type ForgotFormData = z.infer<typeof forgotPasswordSchema>

export const resetSchema = z.object({
  password: z.string()
    .trim()
    .min(1, 'Vui lòng nhập mật khẩu!')
    .min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự!')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa!')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường!')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số!')
    .regex(/[@$!%*?&]/, 'Mật khẩu phải có ít nhất 1 kí tự đặc biệt!'),
  confirmPassword: z.string()
    .min(1, 'Vui lòng xác nhận mật khẩu!')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp!',
  path: ['confirmPassword']
})

export type ResetFormData = z.infer<typeof resetSchema>

export const registerSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Vui lòng nhập họ tên!')
    .max(50, 'Họ tên không được vượt quá 50 ký tự!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Vui lòng nhập email của bạn!')
    .pipe(z.email('Email không hợp lệ')),

  password: z.string()
    .trim()
    .min(1, 'Vui lòng nhập mật khẩu!')
    .min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự!')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa!')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường!')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số!')
    .regex(/[@$!%*?&]/, 'Mật khẩu phải có ít nhất 1 kí tự đặc biệt!'),

  confirmPassword: z.string()
    .min(1, 'Vui lòng xác nhận mật khẩu!')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp!',
  path: ['confirmPassword']
})

export type RegisterFormData = z.infer<typeof registerSchema>