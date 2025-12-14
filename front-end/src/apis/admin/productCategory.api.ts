import type { AllParams } from '~/types/helper.type'
import type { ProductCategoryAPIResponse, ProductCategoryDetailInterface } from '~/types/productCategory.type'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAllProductCategoriesAPI = async (
  params: AllParams
): Promise<ProductCategoryAPIResponse> => {
  const queryParams = new URLSearchParams()
  if (params.status) queryParams.set('status', params.status)
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/products-category?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

// export const fetchChangeStatusAPI = async (status: string, id: string) => {
//   const response = await authorizedAxiosInstance.patch(
//     `${API_ROOT}/admin/products-category/change-status/${status}/${id}`,
//     { status },
//     { withCredentials: true }
//   )
//   return response.data
// }

export const fetchChangeStatusWithChildren = async (status: string, id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products-category/change-status-with-children/${status}/${id}`,
    {},
    { withCredentials: true }
  )
  return response.data
}

export const fetchDeleteProductCategoryAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/products-category/delete/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailProductCategoryAPI = async (id: string): Promise<ProductCategoryDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/products-category/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditProductCategoryAPI = async (id: string, formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products-category/edit/${id}`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchCreateProductCategoryAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/products-category/create`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products-category/change-multi`,
    data,
    { withCredentials: true }
  )
  return response.data
}

export const fetchProductCategoryTrashAPI = async (
  params: AllParams
): Promise<ProductCategoryAPIResponse> => {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/products-category/trash?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeMultiTrashAPI = async (data: { ids: string[], type: string }) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products-category/trash/form-change-multi-trash`,
    data,
    { withCredentials: true }
  )
  return response.data
}

export const fetchPermanentlyDeleteProductCategoryAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/products-category/trash/permanentlyDelete/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchRecoverProductCategoryAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products-category/trash/recover/${id}`,
    {},
    { withCredentials: true }
  )
  return response.data
}