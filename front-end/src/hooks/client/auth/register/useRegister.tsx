/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchRegisterAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '~/validations/client/auth.validate'

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