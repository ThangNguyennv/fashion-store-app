export interface AccountInterface {
  fullName: string
  email: string
  password: string
  phone: String
  avatar: string
  role_id: string
  status: 'ACTIVE' | 'INACTIVE',
}