import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailAccountAPI } from '~/apis/admin/account.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { AccountDetailInterface, AccountInfoInterface } from '~/types/account.type'
import type { RoleInfoInterface } from '~/types/role.type'

const useDetail = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [roles, setRoles] = useState<RoleInfoInterface[]>([])
  const { role } = useAuth()

  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    fetchDetailAccountAPI(id).then((response: AccountDetailInterface) => {
      setAccountInfo(response.account)
      setRoles(response.roles)
    })
  }, [id])
  return {
    accountInfo,
    roles,
    role
  }
}

export default useDetail