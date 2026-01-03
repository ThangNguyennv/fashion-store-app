import type { RoleInfoInterface } from './role.type'

export interface AccountInfoInterface {
  _id: string,
  avatar: string,
  fullName: string,
  email: string,
  password: string,
  phone: string,
  status: 'ACTIVE' | 'INACTIVE',
  role_id: string
}

export interface MyAccountAPIResponse {
  myAccount: AccountInfoInterface,
  role: RoleInfoInterface
}

export interface AccountsDetailInterface {
  accounts: AccountInfoInterface[],
  roles: RoleInfoInterface[]
}

export interface AccountDetailInterface {
  account: AccountInfoInterface,
  roles: RoleInfoInterface[]
}