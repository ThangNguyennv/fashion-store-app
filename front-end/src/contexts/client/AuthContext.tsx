/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchInfoUserAPI } from '~/apis/client/user.api'
import type { UserAPIResponse } from '~/types/user.type'
import CircularProgress from '@mui/material/CircularProgress'

interface AuthContextType {
  accountUser: UserAPIResponse['accountUser'] | null
  setAccountUser: (user: UserAPIResponse['accountUser'] | null) => void
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  authChecked: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthClientProvider = ({ children }: { children: ReactNode }) => {
  const [accountUser, setAccountUser] = useState<AuthContextType['accountUser']>(null)
  const [isLoading, setIsLoading] = useState(true)
  // authChecked = “đã kiểm tra session hiện tại chưa”
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response: UserAPIResponse = await fetchInfoUserAPI()
        if (response.accountUser) {
          setAccountUser(response.accountUser)
        } else {
          setAccountUser(null)
        }
      } catch (error) {
        setAccountUser(null)
      } finally {
        setAuthChecked(true)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])
  // (Trung tâm điều khiển): Đang lắng nghe loa phóng thanh (addEventListener) -> Nghe thấy tiếng báo động -> Thực hiện hành động dọn dẹp (setAccountUser(null)).
  useEffect(() => {
    const handleForceLogout = () => {
      setAccountUser(null)
      setAuthChecked(true)
    }

    window.addEventListener('force-logout', handleForceLogout)
    return () => window.removeEventListener('force-logout', handleForceLogout)
  }, [])
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    )
  }

  const logout = async (): Promise<void> => {
    setAccountUser(null)
    setAuthChecked(true)
  }

  const refreshUser = async (): Promise<void> => {
    const response: UserAPIResponse = await fetchInfoUserAPI()
    if (response.accountUser) {
      setAccountUser(response.accountUser)
    }
  }

  return (
    <AuthContext.Provider value={{ accountUser, setAccountUser, isLoading, isAuthenticated: authChecked && !!accountUser, refreshUser, logout, authChecked }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}