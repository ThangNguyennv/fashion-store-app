/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLoginAPI } from '~/apis/admin/auth.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '~/validations/admin/auth.validation'

export const useLoginAdmin = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [showPassword, setShowPassword] = useState(false)
  const { setMyAccount, setRole } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      const response = await fetchLoginAPI(data.email, data.password)

      if (response.code === 200 && response.accountAdmin) {
        setMyAccount(response.accountAdmin)
        setRole(response.role)
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        // await refreshUser()
        // ;(window as any).bumpAdminAuth?.() // ép remount AuthAdminProvider
        navigate('/admin/admin-welcome', { replace: true })
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      }
    } catch (error: any) {
      // if (error.status === 429) {
      //   dispatchAlert({
      //     type: 'SHOW_ALERT',
      //     payload: { message: error.response.data.message, severity: 'error' }
      //   })
      // }
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: error.response.data.message, severity: 'error' }
      })
      // dispatchAlert({
      //   type: 'SHOW_ALERT',
      //   payload: { message: 'Đã xảy ra lỗi, vui lòng thử lại.', severity: 'error' }
      // })
    }
  }
  return {
    handleSubmit,
    showPassword,
    setShowPassword,
    register,
    errors,
    isSubmitting,
    onSubmit
  }
}

