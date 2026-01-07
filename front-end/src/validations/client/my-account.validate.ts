import { z } from 'zod'

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .trim()
    .min(1, 'Vui lòng nhập mật khẩu hiện tại!'),

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

export type changePasswordFormData = z.infer<typeof changePasswordSchema>

export const editProfileSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Họ và tên không được để trống!')
    .max(50, 'Họ tên không được vượt quá 50 ký tự!'),

  email: z.string()
    .trim()
    .toLowerCase()
    .min(1, 'Email không được để trống!')
    .pipe(z.email('Email không hợp lệ')),

  phone: z.string()
    .trim()
    .refine((val) => {
      if (val === '') return true
      return /^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(val)
    }, {
      message: 'Số điện thoại không hợp lệ (phải bắt đầu bằng 03,05,07,08,09 hoặc +84)!'
    }),

  address: z.string()
    .trim()
    .optional(),

  avatar: z.any().optional()
})

export type EditProfileFormData = z.infer<typeof editProfileSchema>