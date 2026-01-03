export interface UserInfoInterface {
  _id: string,
  fullName: string,
  email: string,
  address: string,
  status: 'ACTIVE' | 'INACTIVE',
  avatar: string,
  phone: string,
  password: string
}


export interface UsersDetailInterface {
  users: UserInfoInterface[],
}

export interface UserAPIResponse {
  accountUser: UserInfoInterface,
  code: number,
  message: string
}