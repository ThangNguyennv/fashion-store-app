import type { SettingGeneralAPIResponse } from '~/interfaces/setting.interface'
import authorizedAxiosInstance from '~/utils/authorizedAxiosClient'
import { API_ROOT } from '~/utils/constants'

export const fetchSettingGeneralAPI = async (): Promise<SettingGeneralAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/settings/general`
  )
  return response.data
}
