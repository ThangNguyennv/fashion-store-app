/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GeneralInfoInterface, HelperInterface, PaginationInterface, ParamsInterface } from './helper.type'

export interface BrandCategory extends GeneralInfoInterface {
  parent_id?: string
  description?: string
  children?: BrandCategory[] // Dùng để tạo cây (tree)
}

export interface BrandCategoriesResponseInterface {
  code: number
  message: string
  categories: BrandCategory[]
}

export interface Brand extends GeneralInfoInterface {
  description?: string
  brand_category_id?: string
}

export interface BrandGroup {
  _id?: string
  title: string
  slug?: string
  thumbnail: string
  status: 'ACTIVE' | 'INACTIVE'
  pagination: PaginationInterface
}

export interface BrandsClientResponseInterface {
  code: number
  message: string
  brands: BrandGroup[]
}

export interface BrandsAdminResponseInterface {
  code: number
  message: string
  brands: Brand[]
  pagination?: any
}

export interface BrandStates extends HelperInterface, ParamsInterface {
  brands: Brand[]
}

export type BrandActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<BrandStates> }
  | { type: 'RESET' }


export interface BranchApiResponse {
  code: number
  message: string
  [key: string]: any
}