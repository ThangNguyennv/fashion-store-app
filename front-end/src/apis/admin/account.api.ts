import type { AccountAPIResponse, AccountsAPIResponse } from '~/types/account.type'
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'

export const fetchAccountsAPI = async (): Promise<AccountsAPIResponse> => {
  const resposne = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/accounts`
  )
  return resposne.data
}

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/accounts/change-status/${status}/${id}`,
    { status }
  )
  return response.data
}

export const fetchCreateAccountAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/accounts/create`,
    formData
  )
  return response.data
}

export const fetchDetailAccountAPI = async (id: string): Promise<AccountAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/accounts/detail/${id}`
  )
  return response.data
}

export const fetchEditAccountAPI = async (id: string, formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/accounts/edit/${id}`,
    formData
  )
  return response.data
}

export const fetchDeleteAccountAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/accounts/delete/${id}`
  )
  return response.data
}