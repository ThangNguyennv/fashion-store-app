import { z } from 'zod'

export const checkoutSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Vui lòng nhập họ tên!')
    .max(50, 'Họ tên không được vượt quá 50 ký tự!'),

  phone: z.string()
    .trim()
    .min(1, 'Số điện thoại là bắt buộc')
    .regex(/^(0[35789]\d{8}|\+84[35789]\d{8})$/, 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09 hoặc +84)'),

  address: z.string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ của bạn!'),

  note: z.string().trim().optional(),
  paymentMethod: z.enum(['COD', 'MOMO', 'VNPAY', 'ZALOPAY'], {
    message: 'Phương thức thanh toán không hợp lệ!'
  })
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>