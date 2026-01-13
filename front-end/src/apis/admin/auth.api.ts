import type { LoginAPIResponse, LogoutInterface } from '~/interfaces/auth.interface'
import { API_ROOT } from '~/utils/constants'
import axios from 'axios'

export const fetchLoginAPI = async (email: string, password: string): Promise<LoginAPIResponse> => {
  const response = await axios.post(
    `${API_ROOT}/admin/auth/login`,
    { email, password },
    { withCredentials: true }
  )
  return response.data
}

export const fetchLogoutAPI = async (): Promise<LogoutInterface> => {
  const response = await axios.get(
    `${API_ROOT}/admin/auth/logout`,
    { withCredentials: true }
  )
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await axios.post(
    `${API_ROOT}/admin/auth/refresh-token`,
    {},
    { withCredentials: true }
  )
  return response.data
}