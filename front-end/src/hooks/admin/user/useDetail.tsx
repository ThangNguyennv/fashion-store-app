import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailUserAPI } from '~/apis/admin/user.api'
import type { UserInfoInterface, UserAPIResponse } from '~/interfaces/user.interface'
import { useAuth } from '~/contexts/admin/AuthContext'

const useDetail = () => {
  const [user, setUser] = useState<UserInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { role } = useAuth()

  useEffect(() => {
    fetchDetailUserAPI(id).then((response: UserAPIResponse) => {
      setUser(response.accountUser)
    })
  }, [id])
  return {
    user,
    role
  }
}

export default useDetail