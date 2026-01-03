/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { fetchLoginAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/client/AuthContext'

const loginSchema = z.object({
  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Vui lòng nhập email của bạn!')
    .pipe(z.email('Email không hợp lệ')),
  password: z.string()
    .min(1, 'Vui lòng nhập mật khẩu!')
})

type LoginFormData = z.infer<typeof loginSchema>

const useLoginClient = () => {
  const { setAccountUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { dispatchAlert } = useAlertContext()

  const [showPassword, setShowPassword] = useState(false)
  const API_ROOT = import.meta.env.VITE_API_ROOT
  const googleAuthUrl = `${API_ROOT}/user/auth/google`

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  useEffect(() => {
    const errorType = searchParams.get('error')
    if (errorType === 'account_locked') {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ!', severity: 'error' }
      })
    } else if (errorType === 'auth_failed') {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đăng nhập Google thất bại!', severity: 'error' }
      })
    }
  }, [searchParams])

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      const response = await fetchLoginAPI(data.email, data.password)

      if (response.code === 200 && response.accountUser) {
        setAccountUser(response.accountUser)
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        navigate('/', { replace: true })
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Email hoặc mật khẩu không chính xác.', severity: 'error' }
      })
    }
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    googleAuthUrl
  }
}

export default useLoginClient