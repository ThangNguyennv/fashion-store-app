import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailAccountAPI } from '~/apis/admin/account.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { AccountAPIResponse, AccountInfoInterface } from '~/interfaces/account.interface'

const useDetail = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)
  const { role } = useAuth()

  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    fetchDetailAccountAPI(id).then((response: AccountAPIResponse) => {
      setAccountInfo(response.account)
    })
  }, [id])
  return {
    accountInfo,
    role
  }
}

export default useDetail