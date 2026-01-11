import { type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '~/contexts/admin/AuthContext'
import CircularProgress from '@mui/material/CircularProgress'

const PrivateRouteAdmin = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading, authChecked } = useAuth()

  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/auth/login" replace={true}/>
  }
  return children
}

export default PrivateRouteAdmin