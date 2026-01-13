import type { OrderDetailInterface } from '~/interfaces/order.interface'
import authorizedAxiosInstance from '~/utils/authorizedAxiosClient'
import { API_ROOT } from '~/utils/constants'

export const fetchOrderAPI = async (formData: {note: string, paymentMethod: string, fullName: string, phone: string, address: string }) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/checkout/order`,
    formData
  )
  return response.data
}

export const fetchSuccessAPI = async (orderId: string): Promise<OrderDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/checkout/success/${orderId}`
  )
  return response.data
}