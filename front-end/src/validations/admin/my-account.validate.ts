import { z } from 'zod'

export const editMyAccountSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Họ và tên là bắt buộc')
    .max(50, 'Họ và tên không được quá 50 ký tự')
    .transform((val) => val.replace(/\s+/g, ' ')), // Có dấu cách ở khoảng giữa quá nhiều sẽ đc đưa về chỉ 1 khoảng cách thôi.

  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Email là bắt buộc')
    .pipe(z.email('Email không hợp lệ')),

  phone: z.string()
    .trim()
    .min(1, 'Số điện thoại là bắt buộc')
    .refine(
      val => /^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(val),
      { message: 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09 hoặc +84)' }
    ),

  password: z.string()
    .trim()
    .optional()
    .superRefine((val, ctx) => {
      if (!val || val === '') return

      if (val.length < 8) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 8 kí tự!'
        })
      }
      if (!/[A-Z]/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 1 chữ in hoa!'
        })
      }
      if (!/[a-z]/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 1 chữ in thường!'
        })
      }
      if (!/[0-9]/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 1 số!'
        })
      }

      if (!/[@$!%*?&]/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt!'
        })
      }
    }),

  avatar: z.any().optional()
})

export type EditMyAccountFormData = z.infer<typeof editMyAccountSchema>