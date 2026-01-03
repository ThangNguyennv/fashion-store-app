import type { AllParams } from '~/types/helper.type'
import type { OrderAPIResponse, OrderDetailInterface } from '~/types/order.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosClient'
import { API_ROOT } from '~/utils/constants'

export const fetchOrdersAPI = async (
  params: AllParams
): Promise<OrderAPIResponse> => {
  const queryParams = new URLSearchParams()
  if (params.status) queryParams.set('status', params.status.toUpperCase())
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)
  if (params.date) queryParams.set('date', params.date)
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/user/my-orders?${queryParams.toString()}`
  )
  return response.data
}

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/orders/change-status/${status}/${id}`,
    { status }
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/orders/change-multi`,
    data
  )
  return response.data
}

export const fetchDeleteOrderAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/orders/delete/${id}`
  )
  return response.data
}

export const fetchPermanentlyDeleteOrderAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/orders/permanentlyDelete/${id}`
  )
  return response.data
}

export const fetchDetailOrderAPI = async (id: string): Promise<OrderDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/orders/detail/${id}`
  )
  return response.data
}

export const fetchRecoverOrderAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/orders/recover/${id}`,
    {}
  )
  return response.data
}