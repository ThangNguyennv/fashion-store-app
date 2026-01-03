import { API_ROOT } from '~/utils/constants'
import type { AdminChatRoomsResponse, AdminChatHistoryResponse } from '~/types/chat.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'

export const fetchAdminChatRoomsAPI = async (): Promise<AdminChatRoomsResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/chats`
  )
  return response.data
}

export const fetchAdminChatHistoryAPI = async (userId: string): Promise<AdminChatHistoryResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/chats/${userId}`
  )
  return response.data
}
