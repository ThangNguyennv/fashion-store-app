import { API_ROOT } from '~/utils/constants'
import type { ClientChatResponse } from '~/types/chat.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosClient'

export const fetchClientChatAPI = async (): Promise<ClientChatResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/chats`
  )
  return response.data
}

