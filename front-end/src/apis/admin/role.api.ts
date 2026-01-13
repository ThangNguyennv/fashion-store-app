import type { RoleFormData } from '~/hooks/admin/role/useCreate'
import type { EditRoleFormData } from '~/hooks/admin/role/useEdit'
import type { PermissionsInterface, RolesDetailInterface, RolesResponseInterface } from '~/interfaces/role.interface'
import authorizedAxiosInstance from '~/utils/authorizedAxiosAdmin'
import { API_ROOT } from '~/utils/constants'

export const fetchRoleAPI = async (): Promise<RolesResponseInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/roles`
  )
  return response.data
}

export const fetchDetailRoleAPI = async (id: string): Promise<RolesDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/roles/detail/${id}`
  )
  return response.data
}

export const fetchCreateRoleAPI = async (data: RoleFormData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/roles/create`,
    data
  )
  return response.data
}

export const fetchEditRoleAPI = async (id: string, payload: EditRoleFormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/roles/edit/${id}`,
    payload
  )
  return response.data
}

export const fetchDeleteRoleAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/roles/delete/${id}`
  )
  return response.data
}

export const fetchPermissions = async (permissions: PermissionsInterface[]) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/roles/permissions`,
    { permissions }
  )
  return response.data
}