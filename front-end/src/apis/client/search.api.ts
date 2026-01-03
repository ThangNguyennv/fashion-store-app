import axios from 'axios'
import type { SearchInterface } from '~/types/search.type'
import { API_ROOT } from '~/utils/constants'

export const fetchSearchAPI = async (currentKeyword: string): Promise<SearchInterface> => {
  const queryParams = new URLSearchParams()
  if (currentKeyword) queryParams.set('keyword', currentKeyword)
  const response = await axios.get(
    `${API_ROOT}/search?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

