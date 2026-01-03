import axios from 'axios'
import type { HomeAPIReponse } from '~/types/home.type'
import { API_ROOT } from '~/utils/constants'

export const fetchHomeAPI = async (): Promise<HomeAPIReponse> => {
  const response = await axios.get(
    `${API_ROOT}/`,
    { withCredentials: true }
  )
  return response.data
}