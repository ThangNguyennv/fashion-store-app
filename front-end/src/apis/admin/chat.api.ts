import { API_ROOT } from '~/utils/constants'
import type { AdminChatRoomsAPIResponse, AdminChatHistoryAPIResponse } from '~/interfaces/chat.interface'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'

export const fetchAdminChatRoomsAPI = async (): Promise<AdminChatRoomsAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/chats`
  )
  return response.data
}

export const fetchAdminChatHistoryAPI = async (userId: string): Promise<AdminChatHistoryAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/chats/${userId}`
  )
  return response.data
}
