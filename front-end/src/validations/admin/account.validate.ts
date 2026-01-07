import { z } from 'zod'

export const accountSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Họ và tên là bắt buộc!')
    .max(50, 'Họ và tên không được quá 50 ký tự!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Email là bắt buộc!')
    .pipe(z.email('Email không hợp lệ')),

  password: z.string()
    .trim()
    .min(1, 'Mật khẩu là bắt buộc!')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự!')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa!')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường!')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số!')
    .regex(/[@$!%*?&]/, 'Mật khẩu phải có ít nhất 1 kí tự đặc biệt!'),

  phone: z.string()
    .trim()
    .min(1, 'Số điện thoại là bắt buộc')
    .refine(
      val => /^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(val),
      { message: 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09 hoặc +84)' }
    ),

  role_id: z.string()
    .min(1, 'Vui lòng chọn phân quyền!'),

  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái không hợp lệ!'
  }),

  avatar: z.any().optional()
})

export type AccountFormData = z.infer<typeof accountSchema>

export const editAccountSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Họ và tên là bắt buộc')
    .min(5, 'Họ và tên phải có ít nhất 5 ký tự')
    .max(50, 'Họ và tên không được quá 50 ký tự')
    .transform((val) => val.replace(/\s+/g, ' ')), // Bỏ các khoảng trống dư thừa ở những đoạn giữa

  email: z.string()
    .trim()
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

  role_id: z.string().min(1, 'Vui lòng chọn phân quyền'),

  status: z.enum(['ACTIVE', 'INACTIVE']),

  avatar: z.any().optional()
})

export type EditAccountFormData = z.infer<typeof editAccountSchema>