import type { ArticleAPIResponse } from '~/interfaces/article.interface'
import type { ArticleDetailInterface } from '~/interfaces/article.interface'
import type { AllParams } from '~/interfaces/helper.interface'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'
import { API_ROOT } from '~/utils/constants'

export const fetchArticleAPI = async (
  params: AllParams
): Promise<ArticleAPIResponse> => {
  const queryParams = new URLSearchParams()
  if (params.status) queryParams.set('status', params.status.toUpperCase())
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/articles?${queryParams.toString()}`
  )
  return response.data
}

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/articles/change-status/${status}/${id}`,
    { status }
  )
  return response.data
}

export const fetchDetailArticleAPI = async (id: string): Promise<ArticleDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/articles/detail/${id}`
  )
  return response.data
}

export const fetchEditArticleAPI = async (id: string, formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/articles/edit/${id}`,
    formData
  )
  return response.data
}

export const fetchDeleteArticleAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/articles/delete/${id}`
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/articles/change-multi`,
    data
  )
  return response.data
}

export const fetchCreateArticleAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/articles/create`,
    formData
  )
  return response.data
}

