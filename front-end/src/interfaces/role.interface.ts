import type { AccountInfoInterface } from './account.interface'
import type { UpdatedBy } from './helper.interface'

export interface RoleInfoInterface {
  _id: string,
  title: string,
  titleId: string,
  description: string,
  permissions: string[],
  updatedBy?: UpdatedBy[],
  createdAt: Date | null
  updatedAt: Date | null
}

export interface PermissionsInterface {
  _id: string,
  permissions: string[]
}
export interface RolesResponseInterface {
  roles: RoleInfoInterface[],
  accounts: AccountInfoInterface[]
}
export interface RolesDetailInterface {
  role: RoleInfoInterface
}