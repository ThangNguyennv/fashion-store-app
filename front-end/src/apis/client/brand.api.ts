import axios from 'axios'
import type { BrandsClientResponseInterface } from '~/interfaces/brand.interface'
import { API_ROOT } from '~/utils/constants'

export const fetchClientBrandsAPI = async (): Promise<BrandsClientResponseInterface> => {
  const response = await axios.get(
    `${API_ROOT}/brands`,
    { withCredentials: true }
  )
  return response.data
}
