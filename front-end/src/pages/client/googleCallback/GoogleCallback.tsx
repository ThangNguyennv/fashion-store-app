/* eslint-disable no-console */
// src/pages/GoogleCallback.tsx
import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '~/contexts/client/AuthContext'
import { CircularProgress, Box } from '@mui/material'
import authorizedAxiosInstance from '~/utils/authorizedAxiosClient'
import { API_ROOT } from '~/utils/constants'

const GoogleCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAccountUser } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const accessTokenUser = searchParams.get('accessTokenUser')
      const refreshTokenUser = searchParams.get('refreshTokenUser')
      const cartId = searchParams.get('cartId')

      if (!accessTokenUser || !refreshTokenUser) {
      // Không có tokenUser, redirect về login
        navigate('/user/login', { replace: true })
        return
      }

      try {
        // 1. Gọi API để Backend set cặp Cookies HttpOnly
        await authorizedAxiosInstance.post(
          `${API_ROOT}/user/set-auth-cookies`,
          { accessTokenUser, refreshTokenUser, cartId }
        )

        // 2. Lấy thông tin User để đưa vào Context
        const response = await authorizedAxiosInstance.get(
          `${API_ROOT}/user/account/info`
        )
        setAccountUser(response.data.accountUser)

        // 3. Xong xuôi, về trang chủ
        navigate('/', { replace: true })
      } catch (error) {
        console.error('Lỗi Google callback:', error)
        navigate('/user/login?error=callback_failed', { replace: true })
      }
    }

    handleCallback()
  }, [searchParams, navigate, setAccountUser])

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
      <p style={{ marginLeft: '16px' }}>Đang xử lý đăng nhập...</p>
    </Box>
  )
}

export default GoogleCallback