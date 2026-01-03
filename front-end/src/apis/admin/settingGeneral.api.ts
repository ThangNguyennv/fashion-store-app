import type { SettingGeneralAPIResponse } from '~/types/setting.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'
import { API_ROOT } from '~/utils/constants'

export const fetchSettingGeneralAPI = async (): Promise<SettingGeneralAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/settings/general`
  )
  return response.data
}

export const fetchEditSettingGeneralAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/settings/general/edit`,
    formData
  )
  return response.data
}