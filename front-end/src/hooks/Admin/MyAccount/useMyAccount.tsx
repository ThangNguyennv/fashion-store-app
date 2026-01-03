import { useEffect, useState } from 'react'
import { fetchMyAccountAPI } from '~/apis/admin/myAccount.api'
import type { AccountInfoInterface, MyAccountAPIResponse } from '~/types/account.type'
import type { RoleInfoInterface } from '~/types/role.type'

export const useMyAccount = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const [role, setRole] = useState<RoleInfoInterface | null>(null)

  useEffect(() => {
    fetchMyAccountAPI().then((data: MyAccountAPIResponse) => {
      setAccountInfo(data.myAccount)
      setRole(data.role)
    })
  }, [])

  return {
    accountInfo,
    setAccountInfo,
    role,
    setRole
  }
}