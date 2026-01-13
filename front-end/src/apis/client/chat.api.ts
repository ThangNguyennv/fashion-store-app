import { API_ROOT } from '~/utils/constants'
import type { ClientChatAPIResponse } from '~/interfaces/chat.interface'
import authorizedAxiosInstance from '~/utils/authorizedAxiosClient'

export const fetchClientChatAPI = async (): Promise<ClientChatAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/chats`
  )
  return response.data
}

