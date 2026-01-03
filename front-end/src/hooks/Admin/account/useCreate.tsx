/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { fetchAccountsAPI, fetchCreateAccountAPI } from '~/apis/admin/account.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountsDetailInterface } from '~/types/account.type'
import type { RoleInfoInterface } from '~/types/role.type'

const accountSchema = z.object({
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

type AccountFormData = z.infer<typeof accountSchema>
const useCreate = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { role } = useAuth()

  // Sử dụng react-hook-form với Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      status: 'ACTIVE',
      role_id: ''
    }
  })

  useEffect(() => {
    fetchAccountsAPI().then((response: AccountsDetailInterface) => {
      setRoles(response.roles)
    })
  }, [])

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Kích thước ảnh không được vượt quá 5MB', severity: 'error' }
        })
        return
      }

      // Validate image type
      if (!file.type.startsWith('image/')) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Vui lòng chọn file ảnh', severity: 'error' }
        })
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      setValue('avatar', file)
    }
  }

  const onSubmit = async (data: AccountFormData): Promise<void> => {
    try {
      const formData = new FormData()

      formData.append('fullName', data.fullName)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('status', data.status)
      formData.append('role_id', data.role_id)
      formData.append('phone', data.phone)

      const file = uploadImageInputRef.current?.files?.[0]
      if (file) {
        formData.append('avatar', file)
      }

      const response = await fetchCreateAccountAPI(formData)

      if (response.code === 201) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate('/admin/accounts')
        }, 2000)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đã có lỗi xảy ra', severity: 'error' }
      })
    }
  }

  const handleClickUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }
  return {
    roles,
    preview,
    role,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleImageChange,
    onSubmit,
    handleClickUpload,
    uploadImageInputRef,
    navigate
  }
}

export default useCreate