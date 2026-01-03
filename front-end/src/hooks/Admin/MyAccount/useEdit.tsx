/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { fetchMyAccountAPI, fetchUpdateMyAccountAPI } from '~/apis/admin/myAccount.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { MyAccountAPIResponse } from '~/types/account.type'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

const editMyAccountSchema = z.object({
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

type EditMyAccountFormData = z.infer<typeof editMyAccountSchema>

export const useEditMyAccount = () => {
  const { dispatchAlert } = useAlertContext()
  const [isLoading, setIsLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<EditMyAccountFormData>({
    resolver: zodResolver(editMyAccountSchema)
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data: MyAccountAPIResponse = await fetchMyAccountAPI()
        const account = data.myAccount
        reset({
          fullName: account.fullName,
          email: account.email,
          phone: account.phone,
          password: ''
        })
        setPreview(account.avatar)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Không thể tải thông tin tài khoản. Vui lòng thử lại!',
            severity: 'error'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [reset, dispatchAlert])

  // Cleanup blob URL to prevent memory leak
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn file ảnh hợp lệ', severity: 'error' }
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Kích thước ảnh không được vượt quá 5MB', severity: 'error' }
      })
      return
    }

    // Revoke old preview URL if exists
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setValue('avatar', file)
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: EditMyAccountFormData) => {
    try {
      const formData = new FormData()

      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('phone', data.phone)

      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password)
      }

      if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar)
      }
      const response = await fetchUpdateMyAccountAPI(formData)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          window.location.href = '/admin/my-account' // Fix load lại trang sau!
        }, 2000)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message || 'Cập nhật thất bại', severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: {
          message: 'Đã có lỗi xảy ra. Vui lòng thử lại!',
          severity: 'error'
        }
      })
    }
  }

  return {
    isLoading,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    navigate,
    preview
  }
}