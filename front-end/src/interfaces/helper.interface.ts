import type { AccountInfoInterface } from './account.interface'

export interface UpdatedBy {
  account_id: AccountInfoInterface | string,
  updatedAt: Date | null
}

export interface CreatedBy {
  account_id: AccountInfoInterface | string
  fullName?: string
}
export interface DeletedBy {
  account_id: AccountInfoInterface | string,
  deletedAt: Date | null
}

export interface FilterStatusInterface {
  name: string,
  status: string,
  class?: string
}

export interface PaginationInterface {
  currentPage: number,
  limitItems: number,
  skip: number,
  totalPage: number,
  totalItems: number
}

export interface HelperInterface {
  accounts: AccountInfoInterface[],
  filterStatus: FilterStatusInterface[],
  pagination: PaginationInterface,
}

export interface ParamsInterface {
  keyword: string,
  date: string,
  sortKey: string,
  sortValue: string
  loading: boolean
}

export interface AllParams {
  status?: string
  page?: number
  keyword?: string
  sortKey?: string
  sortValue?: string
  category?: string
  maxPrice?: string
  color?: string
  size?: string
  date?: string
}

export interface GeneralInfoInterface {
  _id?: string,
  title: string,
  thumbnail: string,
  status: 'ACTIVE' | 'INACTIVE',
  slug?: string,
  createdBy: CreatedBy
  createdAt: Date | null
  updatedBy: UpdatedBy[],
  updatedAt: Date | null,
  deletedBy: DeletedBy,
  lastUpdatedBy?: {
    account_id: string
    fullName: string
    updatedAt: Date | null
  }
}