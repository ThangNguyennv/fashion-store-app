import type { GeneralInfoInterface, HelperInterface } from './helper.interface'
import type { ProductInfoInterface } from './product.interface'

export interface ProductCategoryInfoInterface extends GeneralInfoInterface {
  children: ProductCategoryInfoInterface[] | [],
  parent_id: string,
  description: string,
}

export interface ProductCategoryAPIResponse extends HelperInterface {
  productCategories: ProductCategoryInfoInterface[],
  allProductCategories: ProductCategoryInfoInterface[],
  code: number,
  message: string,
  keyword: string
}

export interface ProductCategoryStates extends HelperInterface {
  productCategories: ProductCategoryInfoInterface[],
  allProductCategories: ProductCategoryInfoInterface[],
  keyword: string
  sortKey: string
  sortValue: string
  loading: boolean,
  date: string,
}

export type ProductCategoryActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductCategoryStates> }

export interface ProductCategoryDetailInterface {
  productCategory: ProductCategoryInfoInterface
}

export interface ProductCategoryForm {
  title: string
  status: string
  description: string
  thumbnail: string
  children: ProductInfoInterface[]
  slug: string
  parent_id: string
}