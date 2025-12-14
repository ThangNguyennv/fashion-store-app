import type { AccountInfoInterface } from './account.type'

export interface UpdatedBy {
  account_id: string,
  updatedAt: Date | null
}

export interface DeletedBy {
  account_id: string,
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


//
export interface CurrentParamsInterface {
  keyword: string,
  currentDate: string,
  currentSortKey: string,
  currentSortValue: string
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
}

export interface GeneralInfoInterface {
  _id?: string,
  createdBy: {
    account_id: string,
  },
  updatedBy: UpdatedBy[],
  title: string,
  thumbnail: string,
  position: number | string,
  status: string,
  slug?: string,
  createdAt: Date | null
  updatedAt: Date | null
}