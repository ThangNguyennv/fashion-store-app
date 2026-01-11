import { useEffect, useState } from 'react'
import { fetchDeleteRoleAPI, fetchRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountInfoInterface } from '~/types/account.type'
import type { RoleInfoInterface, RolesResponseInterface } from '~/types/role.type'
import { useAuth } from '~/contexts/admin/AuthContext'

const useRole = () => {
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const [accounts, setAccounts] = useState<AccountInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { role } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res: RolesResponseInterface = await fetchRoleAPI()
        setRoles(res.roles)
        setAccounts(res.accounts)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fetch roles error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedId) return
    const response = await fetchDeleteRoleAPI(selectedId)
    if (response.code === 204) {
      setRoles((prev) => prev.filter((role) => role._id !== selectedId))
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpen(false)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  return {
    roles,
    accounts,
    open,
    loading,
    role,
    handleOpen,
    handleClose,
    handleDelete
  }
}

export default useRole