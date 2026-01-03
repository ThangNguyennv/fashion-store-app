import { fetchLogoutAPI } from '~/apis/admin/auth.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export const useHeader = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const { myAccount, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { role } = useAuth()
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)
  const handleLogout = async (): Promise<void> => {
    const response = await fetchLogoutAPI()
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      await logout()
      navigate('/admin/auth/login')
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  return {
    myAccount,
    handleLogout,
    handleOpen,
    handleClose,
    anchorEl,
    setAnchorEl,
    role
  }
}