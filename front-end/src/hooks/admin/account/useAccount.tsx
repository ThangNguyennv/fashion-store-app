import { useEffect, useState } from 'react'
import { fetchAccountsAPI, fetchChangeStatusAPI, fetchDeleteAccountAPI } from '~/apis/admin/account.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountsDetailInterface, AccountInfoInterface } from '~/interfaces/account.interface'
import { useAuth } from '~/contexts/admin/AuthContext'

const useAccount = () => {
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
        const res: AccountsDetailInterface = await fetchAccountsAPI()
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

  const handleToggleStatus = async (id: string, currentStatus: string): Promise<void> => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const response = await fetchChangeStatusAPI(newStatus, id)
    if (response.code === 200) {
      setAccounts((prev) => prev.map((account) => account._id === id ? {
        ...account,
        status: newStatus
      }: account))
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

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
    const response = await fetchDeleteAccountAPI(selectedId)
    if (response.code === 204) {
      setAccounts((prev) => prev.filter((item) => item._id != selectedId))
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
    accounts,
    open,
    loading,
    role,
    handleToggleStatus,
    handleOpen,
    handleClose,
    handleDelete
  }
}

export default useAccount