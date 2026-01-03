
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailRoleAPI } from '~/apis/admin/role.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { RolesDetailInterface, RoleInfoInterface } from '~/types/role.type'

const useDetail = () => {
  const [roleDetail, setRoleDetail] = useState<RoleInfoInterface | null>(null)
  const params = useParams()
  const id = params.id
  const { role } = useAuth()

  useEffect(() => {
    if (!id) return
    fetchDetailRoleAPI(id).then((response: RolesDetailInterface) => {
      setRoleDetail(response.role)
    })
  }, [id])
  return {
    roleDetail,
    role,
    id
  }
}

export default useDetail