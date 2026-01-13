import { z } from 'zod'

export const editSettingsGeneralSchema = z.object({
  websiteName: z.string()
    .trim()
    .min(1, 'Tên website là bắt buộc!')
    .max(50, 'Tên website không được quá 50 ký tự!')
    .regex(
      /^[\p{L}\p{N}\s._&'-]+$/u,
      'Tên website chỉ chứa chữ, số và các ký tự đặc biệt (._&\'-)!'
    )
    .transform((val) => val.replace(/\s+/g, ' ')),

  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Email là bắt buộc!')
    .pipe(z.email('Email không hợp lệ!')),

  phone: z.string()
    .trim()
    .min(1, 'Số điện thoại là bắt buộc!')
    .refine(
      val => /^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(val),
      { message: 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09 hoặc +84)!' }
    ),

  address: z.string()
    .trim()
    .min(1, 'Địa chỉ là bắt buộc!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  copyright: z.string()
    .trim()
    .min(1, 'Thông tin bản quyền là bắt buộc!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  logo: z.any().optional()
})

export type EditSettingGeneralFormData = z.infer<typeof editSettingsGeneralSchema>