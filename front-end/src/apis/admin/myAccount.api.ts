import type { MyAccountAPIResponse } from '~/interfaces/account.interface'
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'

export const fetchMyAccountAPI = async (): Promise<MyAccountAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/my-account`
  )
  return response.data
}

export const fetchUpdateMyAccountAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/my-account/edit`,
    formData
  )
  return response.data
}