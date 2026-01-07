/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchForgotPasswordAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { forgotPasswordSchema, type ForgotFormData } from '~/validations/client/auth.validate'

const useForgot = () => {
  // const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: ForgotFormData): Promise<void> => {
    try {
      const response = await fetchForgotPasswordAPI(data.email)

      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })

        // Chuyển hướng sang trang nhập OTP sau 1.5s
        // setTimeout(() => {
        //   navigate(`/user/password/otp?email=${data.email}`)
        // }, 1500)
      } else {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      }
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: {
          message: 'Hệ thống đang bận, vui lòng thử lại sau.',
          severity: 'error'
        }
      })
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit
  }
}

export default useForgot