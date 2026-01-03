import axios from 'axios'
import type { ArticleAPIResponse, ArticlesWithCategoryDetailInterface } from '~/types/article.type'
import type { ArticleDetailInterface } from '~/types/article.type'
import type { AllParams } from '~/types/helper.type'
import { API_ROOT } from '~/utils/constants'

export const fetchAllArticlesAPI = async (
  params: AllParams
): Promise<ArticleAPIResponse> => {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)

  const response = await axios.get(
    `${API_ROOT}/articles?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchArticlesAPI = async (): Promise<ArticleAPIResponse> => {
  const response = await axios.get(
    `${API_ROOT}/articles`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailArticleAPI = async (id: string): Promise<ArticleDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/articles/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailArticleCategoryAPI = async (slugCategory: string): Promise<ArticlesWithCategoryDetailInterface> => {
  const response = await axios.get(
    `${API_ROOT}/articles/${slugCategory}`,
    { withCredentials: true }
  )
  return response.data
}

