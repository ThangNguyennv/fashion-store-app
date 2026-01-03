import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'
import { API_ROOT } from '~/utils/constants'

export const fetchUsersAPI = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/users`
  )
  return response.data
}

export const fetchChangeStatusAPI = async (id: string, status: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/users/change-status/${status}/${id}`,
    { status }
  )
  return response.data
}

export const fetchDeleteUserAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/users/delete/${id}`
  )
  return response.data
}

export const fetchDetailUserAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/users/detail/${id}`
  )
  return response.data
}

export const fetchEditUserAPI = async (id: string, formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/users/edit/${id}`,
    formData
  )
  return response.data
}