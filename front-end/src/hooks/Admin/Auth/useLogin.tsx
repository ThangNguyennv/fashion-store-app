/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchLoginAPI } from '~/apis/admin/auth.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'

export const useLoginAdmin = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setMyAccount, setRole } = useAuth()
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const form = event.currentTarget
      const email = form.email.value
      const password = form.password.value
      const response = await fetchLoginAPI(email, password)

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
      if (error.status === 429) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: error.response.data.message, severity: 'error' }
        })
      }
      // dispatchAlert({
      //   type: 'SHOW_ALERT',
      //   payload: { message: 'Đã xảy ra lỗi, vui lòng thử lại.', severity: 'error' }
      // })
    } finally {
      setIsLoading(false)
    }
  }
  return {
    handleSubmit,
    showPassword,
    setShowPassword,
    isLoading
  }
}

