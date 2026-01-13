/* eslint-disable indent */

import type { ProductCategoryActions, ProductCategoryStates } from '~/interfaces/productCategory.interface'

export const initialState: ProductCategoryStates = {
  productCategories: [],
  accounts: [],
  filterStatus: [],
  pagination: {
    currentPage: 1,
    limitItems: 3,
    skip: 0,
    totalPage: 0,
    totalItems: 0
  },
  keyword: '',
  sortKey: '',
  sortValue: '',
  loading: false,
  allProductCategories: [],
  date: ''
}

export function productCategoryReducer(
  stateProductCategory: ProductCategoryStates,
  actionProductCategory: ProductCategoryActions
): ProductCategoryStates {
  switch (actionProductCategory.type) {
    case 'SET_LOADING':
      return { ...stateProductCategory, loading: actionProductCategory.payload }
    case 'SET_DATA':
      return { ...stateProductCategory, ...actionProductCategory.payload }
    default:
      return stateProductCategory
  }
}