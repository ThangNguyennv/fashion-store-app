import axios from 'axios'
import type { CartDetailInterface } from '~/interfaces/cart.interface'
import { API_ROOT } from '~/utils/constants'

export const fetchCartAPI = async (): Promise<CartDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/cart`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchAddProductToCartAPI = async (
  productId: string,
  quantity: number,
  color?: string | null,
  size?: string | null
) => {
  const response = await axios.post(
    `${API_ROOT}/cart/add/${productId}`,
    {
      quantity, // Gửi quantity trong body
      color, // Gửi color trong body
      size // Gửi size trong body
    },
    { withCredentials: true }
  )
  return response.data
}

// export const fetchDeleteProductInCartAPI = async (productId: string) => {
//   const response = await authorizedAxiosInstance.delete(
//     `${API_ROOT}/cart/delete/${productId}`,
//     { withCredentials: true }
//   )
//   return response.data
// }

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await axios.patch(
    `${API_ROOT}/cart/change-multi`,
    data,
    { withCredentials: true }
  )
  return response.data
}

// Sửa lại hàm xóa
export const fetchDeleteProductInCartAPI = async (item: { productId: string; color: string; size: string }) => {
  const response = await axios.delete(
    `${API_ROOT}/cart/delete-item`, {
      data: item,
      withCredentials: true
    })
  return response.data
}

// Hàm mới để cập nhật số lượng
export const fetchUpdateQuantityAPI = async (data: {
  productId: string;
  color: string;
  size: string;
  quantity: number;
}) => {
  const response = await axios.patch(
    `${API_ROOT}/cart/update-quantity`,
    data,
    { withCredentials: true }
  )
  return response.data
}

// Hàm mới để cập nhật color/size của một sản phẩm trong giỏ hàng
export const fetchUpdateVariantAPI = async (data: {
  productId: string
  oldColor: string
  oldSize: string
  newColor: string
  newSize: string
}) => {
  const response = await axios.patch(
    `${API_ROOT}/cart/update-variant`,
    data,
    { withCredentials: true }
  )
  return response.data
}