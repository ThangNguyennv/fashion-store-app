/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchRegisterAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const registerSchema = z.object({
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

type RegisterFormData = z.infer<typeof registerSchema>

const useRegister = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetchRegisterAPI(
        data.fullName,
        data.email,
        data.password,
        data.confirmPassword
      )

      if (response.code === 201) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate('/user/login')
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
        payload: { message: 'Đã xảy ra lỗi, vui lòng thử lại.', severity: 'error' }
      })
    }
  }

  return {
    handleSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    register,
    errors,
    onSubmit,
    isSubmitting
  }
}

export default useRegister