import type { AccountInfoInterface } from './account.type'
import type { RoleInfoInterface } from './role.type'
export interface LoginAPIResponse {
  code: number,
  email: string,
  password: string,
  accessToken?: string
  message: string,
  accountAdmin: AccountInfoInterface,
  role: RoleInfoInterface
}

export interface LogoutInterface {
  error: Error,
  code: number,
  message: string
}