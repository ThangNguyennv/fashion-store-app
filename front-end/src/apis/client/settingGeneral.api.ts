import type { SettingGeneralAPIResponse } from '~/types/setting.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosClient'
import { API_ROOT } from '~/utils/constants'

export const fetchSettingGeneralAPI = async (): Promise<SettingGeneralAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/settings/general`
  )
  return response.data
}
