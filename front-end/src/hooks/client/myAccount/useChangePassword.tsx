import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchChangePasswordInfoUserAPI, fetchInfoUserAPI } from '~/apis/client/user.api'
import type { UserAPIResponse, UserInfoInterface } from '~/types/user.type'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const useChangePassword = () => {
  const [myAccount, setMyAccount] = useState<UserInfoInterface | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  useEffect(() => {
    fetchInfoUserAPI().then((response: UserAPIResponse) => {
      setMyAccount(response.accountUser)
    })
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!myAccount) return

    const form = event.currentTarget
    const currentPassword = form.currentPassword.value
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value
    const response = await fetchChangePasswordInfoUserAPI(currentPassword, password, confirmPassword)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/user/account/info')
      }, 2000)
    } else if (response.code === 400) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  return {
    showCurrentPassword,
    setShowCurrentPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleSubmit,
    myAccount
  }
}

export default useChangePassword