import type { AccountInfoInterface } from './account.interface'
import type { RoleInfoInterface } from './role.interface'
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