import type { AllParams } from '~/types/helper.type'
import type { ProductAPIResponse, ProductDetailInterface } from '~/types/product.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'
import { API_ROOT } from '~/utils/constants'

export const fetchProductAPI = async (
  params: AllParams
): Promise<ProductAPIResponse> => {
  const queryParams = new URLSearchParams()
  if (params.status) queryParams.set('status', params.status.toUpperCase())
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/products?${queryParams.toString()}`
  )
  return response.data
}

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products/change-status/${status}/${id}`,
    { status }
  )
  return response.data
}

export const fetchDetailProductAPI = async (id: string): Promise<ProductDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/products/detail/${id}`
  )
  return response.data
}

export const fetchEditProductAPI = async (id: string, formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products/edit/${id}`,
    formData
  )
  return response.data
}

export const fetchDeleteProductAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/products/delete/${id}`
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products/change-multi`,
    data
  )
  return response.data
}

export const fetchCreateProductAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/products/create`,
    formData
  )
  return response.data
}

export const fetchProductTrashAPI = async (
  params: AllParams
): Promise<ProductAPIResponse> => {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/products/trash?${queryParams.toString()}`
  )
  return response.data
}

export const fetchChangeMultiTrashAPI = async (data: { ids: string[], type: string }) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products/trash/form-change-multi-trash`,
    data
  )
  return response.data
}

export const fetchPermanentlyDeleteProductAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/products/trash/permanentlyDelete/${id}`
  )
  return response.data
}

export const fetchRecoverProductAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products/trash/recover/${id}`,
    {}
  )
  return response.data
}