import type { StatisticInterface } from '~/interfaces/statistic.interface'
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'

export const fetchStatisticAPI = async (): Promise<StatisticInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/statistics`
  )
  return response.data
}