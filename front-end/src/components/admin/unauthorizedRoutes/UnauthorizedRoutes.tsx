import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '~/contexts/admin/AuthContext'
import CircularProgress from '@mui/material/CircularProgress'

const UnauthorizedRoutesAdmin = () => {
  const { isAuthenticated, isLoading, authChecked } = useAuth()

  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    )
  }
  if (isAuthenticated) {
    return <Navigate to="/admin/admin-welcome" replace={true}/>
  }
  return <Outlet />
}

export default UnauthorizedRoutesAdmin