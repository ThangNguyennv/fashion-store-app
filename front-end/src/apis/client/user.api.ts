import type { OrderInfoInterface } from '~/types/order.type'
import type { UserAPIResponse } from '~/types/user.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosClient'
import { API_ROOT } from '~/utils/constants'

export const fetchInfoUserAPI = async (): Promise<UserAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/user/account/info`
  )
  return response.data
}

export const fetchEditInfoUserAPI = async (formData: FormData): Promise<UserAPIResponse> => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/user/account/info/edit`,
    formData
  )
  return response.data
}

export const fetchChangePasswordInfoUserAPI = async (currentPassword: string, password: string, confirmPassword: string): Promise<UserAPIResponse> => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/user/account/info/change-password`,
    { currentPassword, password, confirmPassword }
  )
  return response.data
}

export const fetchMyOrdersAPI = async (): Promise<OrderInfoInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/user/account/my-orders`
  )
  return response.data
}

export const fetchCancelOrder = async (id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/user/my-orders/cancel-order/${id}`,
    {}
  )
  return response.data
}