import type { ArticleCategoryAPIResponse, ArticleCategoryDetailInterface } from '~/types/articleCategory.type'
import type { AllParams } from '~/types/helper.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'
import { API_ROOT } from '~/utils/constants'

export const fetchArticleCategoryAPI = async (
  params: AllParams
): Promise<ArticleCategoryAPIResponse> => {
  const queryParams = new URLSearchParams()
  if (params.status) queryParams.set('status', params.status.toUpperCase())
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/articles-category?${queryParams.toString()}`
  )
  return response.data
}

export const fetchDeleteArticleCategoryAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/articles-category/delete/${id}`
  )
  return response.data
}

export const fetchDetailArticleCategoryAPI = async (id: string): Promise<ArticleCategoryDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/articles-category/detail/${id}`
  )
  return response.data
}

export const fetchEditArticleCategoryAPI = async (id: string, formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/articles-category/edit/${id}`,
    formData
  )
  return response.data
}

export const fetchCreateArticleCategoryAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/articles-category/create`,
    formData
  )
  return response.data
}

export const fetchChangeStatusWithChildren = async (status: string, id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/articles-category/change-status-with-children/${status}/${id}`,
    {}
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/articles-category/change-multi`,
    data
  )
  return response.data
}