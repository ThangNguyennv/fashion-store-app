import { Navigate } from 'react-router-dom'
import { useAuth } from '~/contexts/client/AuthContext'
import CircularProgress from '@mui/material/CircularProgress'
import type { JSX } from 'react'

const UnauthorizedRoutesClient = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading, authChecked } = useAuth()

  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    )
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace={true}/>
  }
  return children
}

export default UnauthorizedRoutesClient