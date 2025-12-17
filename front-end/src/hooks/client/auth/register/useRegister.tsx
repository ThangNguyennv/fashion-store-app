/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchRegisterAPI } from '~/apis/client/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const useRegister = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatchAlert } = useAlertContext()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      const form = event.currentTarget
      const fullName = form.fullName.value
      const email = form.email.value
      const password = form.password.value
      const confirmPassword = form.confirmPassword.value
      const response = await fetchRegisterAPI(fullName, email, password, confirmPassword)

      if (response.code === 201) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
        setTimeout(() => {
          navigate('/user/login')
        }, 2000)
      } else if (response.code === 401) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'error' }
        })
      } else if (response.code === 400) {
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
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading
  }
}

export default useRegister