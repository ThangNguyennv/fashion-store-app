import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const fetchLoginAPI = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_ROOT}/user/login`,
    { email, password },
    { withCredentials: true }
  )
  return response.data
}

export const fetchLogoutAPI = async () => {
  const response = await axios.get(
    `${API_ROOT}/user/logout`,
    { withCredentials: true }
  )
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await axios.post(
    `${API_ROOT}/user/refresh-token`,
    {},
    { withCredentials: true }
  )
  return response.data
}

export const fetchRegisterAPI = async (fullName: string, email: string, password: string, confirmPassword: string) => {
  const response = await axios.post(
    `${API_ROOT}/user/register`,
    { fullName, email, password, confirmPassword },
    { withCredentials: true }
  )
  return response.data
}

export const fetchForgotPasswordAPI = async (email: string) => {
  const response = await axios.post(
    `${API_ROOT}/user/password/forgot`,
    { email },
    { withCredentials: true }
  )
  return response.data
}

export const fetchOTPPasswordAPI = async (email: string, otp: string) => {
  const response = await axios.post(
    `${API_ROOT}/user/password/otp`,
    { email, otp },
    { withCredentials: true }
  )
  return response.data
}

// export const fetchResetPasswordOTPAPI = async (password: string, confirmPassword: string) => {
//   const response = await axios.post(
//     `${API_ROOT}/user/password/reset`,
//     { password, confirmPassword },
//     { withCredentials: true }
//   )
//   return response.data
// }

export const fetchResetPasswordAPI = async (password: string, confirmPassword: string, resetToken: string) => {
  const response = await axios.post(
    `${API_ROOT}/user/password/reset`,
    { password, confirmPassword, resetToken },
    { withCredentials: true }
  )
  return response.data
}