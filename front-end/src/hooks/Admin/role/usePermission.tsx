import { useEffect, useState } from 'react'
import { fetchPermissions, fetchRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { PermissionsInterface, RoleInfoInterface, RolesResponseInterface } from '~/types/role.type'
import { useAuth } from '~/contexts/admin/AuthContext'
import { permissionSections } from '~/utils/constants'

const usePermission = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const [permissionsData, setPermissionsData] = useState<PermissionsInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const [loading, setLoading] = useState(false)
  const { role } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res: RolesResponseInterface = await fetchRoleAPI()
        setRoles(res.roles)
        setPermissionsData(res.roles.map(role => ({ _id: String(role._id), permissions: role.permissions || [] })))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fetch roles error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCheckboxChange = (roleIndex: number, permKey: string, checked: boolean) => {
    setPermissionsData((prev) => {
      return prev.map((item, index) => {
        if (index !== roleIndex) return item //  Không cùng role
        const newPermission = checked ? [...item.permissions, permKey] : item.permissions.filter(p => p !== permKey)
        return { ...item, permissions: newPermission } // ghi đè permissions mới
      })
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetchPermissions(permissionsData)
      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
      }
    } catch (error) {
      alert('error'+ error)
    }
  }
  return {
    permissionSections,
    roles,
    loading,
    role,
    handleCheckboxChange,
    handleSubmit,
    permissionsData
  }
}

export default usePermission