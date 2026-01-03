/* eslint-disable no-unused-vars */
import type { AccountInfoInterface } from './account.type'
import type { GeneralInfoInterface, HelperInterface } from './helper.type'

export interface ProductInfoInterface extends GeneralInfoInterface {
  price: number,
  discountPercentage: number,
  stock: number,
  featured: '1' | '0',
  product_category_id: string,
  description: string,
  priceNew?: number
  colors: {
    name: string
    code: string,
    images: (File | string)[]
  }[]
  sizes: string[],
  stars: {
    average: number,
    count: number
  },
  comments: {
    user_id: AccountInfoInterface,
    rating: number,
    content: string,
    status: string,
    images: string[],
    createdAt: Date | null
    updatedAt: Date | null
    color: string,
    size: string
  }[]
}

export interface ProductForm {
  title: string
  thumbnail: string
  status: string

  price: number
  discountPercentage: number
  stock: number
  featured: string
  product_category_id: string
  description: string

  colors: {
    name: string
    code: string
    images: (File | string)[]
  }[]

  sizes: string[]
}

export interface ProductAPIResponse extends HelperInterface {
  products: ProductInfoInterface[],
  allProducts: ProductInfoInterface[],
  code: number,
  message: string,
  keyword: string
}

export interface ProductStates extends HelperInterface {
  products: ProductInfoInterface[],
  allProducts: ProductInfoInterface[],
  category?: string,
  maxPrice?: string,
  color?: string,
  size?: string,
  keyword: string
  sortKey: string
  sortValue: string
  isLoading: boolean,
}

export type ProductActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductStates> }

export type ProductClientActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ProductStates> }

export interface ProductDetailInterface {
  product: ProductInfoInterface
}

export interface ProductsWithCategoryDetailInterface {
  products: ProductInfoInterface[],
  pageTitle: string
}

export interface SortDropdownProps {
  sortKey: string
  sortValue: string
  onSortChange: (key: string, value: string) => void
  isMobile?: boolean
}