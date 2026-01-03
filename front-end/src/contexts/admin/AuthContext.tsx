/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchMyAccountAPI } from '~/apis/admin/myAccount.api'
import type { MyAccountAPIResponse } from '~/types/account.type'
import CircularProgress from '@mui/material/CircularProgress'

interface AuthContextType {
  myAccount: MyAccountAPIResponse['myAccount'] | null
  role: MyAccountAPIResponse['role'] | null
  setMyAccount: (account: MyAccountAPIResponse['myAccount'] | null) => void
  setRole: (role: MyAccountAPIResponse['role'] | null) => void
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  authChecked: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthAdminProvider = ({ children }: { children: ReactNode }) => {
  const [myAccount, setMyAccount] = useState<AuthContextType['myAccount']>(null)
  const [role, setRole] = useState<AuthContextType['role']>(null)
  const [isLoading, setIsLoading] = useState(true)
  // authChecked = “đã kiểm tra session hiện tại chưa”
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response: MyAccountAPIResponse = await fetchMyAccountAPI()
        if (response.myAccount && response.role) {
          setMyAccount(response.myAccount)
          setRole(response.role)
        } else {
          setMyAccount(null)
          setRole(null)
        }
      } catch (error) {
        setMyAccount(null)
        setRole(null)
      } finally {
        setAuthChecked(true)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  useEffect(() => {
    const handleForceLogout = () => {
      setMyAccount(null)
      setRole(null)
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
    setMyAccount(null)
    setRole(null)
    setAuthChecked(true)
  }

  const refreshUser = async (): Promise<void> => {
    const response: MyAccountAPIResponse = await fetchMyAccountAPI()
    if (response.myAccount && response.role) {
      setMyAccount(response.myAccount)
      setRole(response.role)
    }
  }

  return (
    <AuthContext.Provider value={{ myAccount, role, setMyAccount, setRole, isLoading, isAuthenticated: authChecked && !!myAccount, refreshUser, logout, authChecked }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}