/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { fetchResetPasswordAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const resetSchema = z.object({
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

type ResetFormData = z.infer<typeof resetSchema>

const useReset = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { dispatchAlert } = useAlertContext()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' }
  })

  useEffect(() => {
    const urlToken = searchParams.get('resetToken')
    if (urlToken) {
      setResetToken(urlToken)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đường dẫn không hợp lệ hoặc đã hết hạn.', severity: 'error' }
      })
      navigate('/user/login')
    }
  }, [searchParams, navigate, dispatchAlert])

  // 4. XỬ LÝ SUBMIT
  const onSubmit = async (data: ResetFormData): Promise<void> => {
    if (!resetToken) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Token không hợp lệ.', severity: 'error' } })
      return
    }

    try {
      const response = await fetchResetPasswordAPI(data.password, data.confirmPassword, resetToken)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => navigate('/user/login'), 1500)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Đã xảy ra lỗi, vui lòng thử lại sau.', severity: 'error' }
      })
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword
  }
}

export default useReset