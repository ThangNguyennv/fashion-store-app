/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailUserAPI, fetchEditUserAPI } from '~/apis/admin/user.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { UserAPIResponse } from '~/types/user.type'
import { useAuth } from '~/contexts/admin/AuthContext'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const editUserSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Họ và tên là bắt buộc')
    .max(50, 'Họ và tên không được quá 50 ký tự')
    .transform((val) => val.replace(/\s+/g, ' ')),

  email: z.string()
    .trim()
    .min(1, 'Email là bắt buộc')
    .pipe(z.email('Email không hợp lệ')),

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

  phone: z.string()
    .trim()
    .optional()
    .superRefine(
      (val, ctx) => {
        if (val === undefined || val === '') return

        if (!/^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(val)) {
          ctx.addIssue({
            code: 'custom',
            message:
          'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09 hoặc +84)'
          })
        }
      }
    ),

  address: z.string()
    .trim()
    .optional(),

  status: z.enum(['ACTIVE', 'INACTIVE']),

  avatar: z.any().optional()
})
type EditUserFormData = z.infer<typeof editUserSchema>

const useEdit = () => {
  // const [userInfo, setUserInfo] = useState<UserInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      status: 'ACTIVE'
    }
  })
  const watchedStatus = watch('status')
  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response: UserAPIResponse = await fetchDetailUserAPI(id)
        const user = response.accountUser
        reset({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          status: user.status,
          password: ''
        })
        setPreview(user.avatar)

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
  }, [id, reset, dispatchAlert])
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

    // Validate file type
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
  const onSubmit = async (data: EditUserFormData) => {
    if (!id) return

    try {
      const formData = new FormData()

      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('status', data.status)
      if (data.address && data.address.trim() !== '') {
        formData.append('address', data.address)
      }
      if (data.phone && data.phone.trim() !== '') {
        formData.append('phone', data.phone)
      }

      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password)
      }

      if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar)
      }

      const response = await fetchEditUserAPI(id, formData)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => navigate(`/admin/users/detail/${id}`), 1500)
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
    role,
    isLoading,
    register,
    handleSubmit,
    errors,
    watchedStatus,
    handleImageChange,
    onSubmit,
    preview,
    isSubmitting
  }
}

export default useEdit