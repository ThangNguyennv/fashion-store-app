import type { RoleInfoInterface } from './role.interface'

export interface AccountInfoInterface {
  _id: string,
  avatar: string,
  fullName: string,
  email: string,
  password: string,
  phone: string,
  status: 'ACTIVE' | 'INACTIVE',
  role_id: RoleInfoInterface
}

export interface MyAccountAPIResponse {
  myAccount: AccountInfoInterface,
  role: RoleInfoInterface
}

export interface AccountsAPIResponse {
  accounts: AccountInfoInterface[],
  roles: RoleInfoInterface[]
}

export interface AccountAPIResponse {
  account: AccountInfoInterface,
  roles: RoleInfoInterface[]
}