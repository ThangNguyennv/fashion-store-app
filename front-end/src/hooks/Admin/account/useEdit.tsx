/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailAccountAPI, fetchEditAccountAPI } from '~/apis/admin/account.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountDetailInterface } from '~/types/account.type'
import type { RoleInfoInterface } from '~/types/role.type'
import { useAuth } from '~/contexts/admin/AuthContext'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const editAccountSchema = z.object({
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

type EditAccountFormData = z.infer<typeof editAccountSchema>

const useEdit = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<EditAccountFormData>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: {
      status: 'ACTIVE'
    }
  })

  const watchedStatus = watch('status')

  // Fetch account details
  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response: AccountDetailInterface = await fetchDetailAccountAPI(id)
        const acc = response.account
        setRoles(response.roles)

        reset({
          fullName: acc.fullName,
          email: acc.email,
          phone: acc.phone || '',
          role_id: acc.role_id,
          status: acc.status,
          password: ''
        })

        setPreview(acc.avatar)
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

  const onSubmit = async (data: EditAccountFormData) => {
    if (!id) return

    try {
      const formData = new FormData()

      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('role_id', data.role_id)
      formData.append('status', data.status)
      formData.append('phone', data.phone)

      if (data.password && data.password.trim() !== '') {
        formData.append('password', data.password)
      }

      if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar)
      }

      const response = await fetchEditAccountAPI(id, formData)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => navigate(`/admin/accounts/detail/${id}`), 1500)
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
    roles,
    isLoading,
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watchedStatus,
    handleImageChange,
    onSubmit,
    preview,
    navigate,
    id
  }
}

export default useEdit