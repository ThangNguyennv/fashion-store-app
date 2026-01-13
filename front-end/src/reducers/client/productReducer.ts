/* eslint-disable indent */
import type { ProductClientActions, ProductStates } from '~/interfaces/product.interface'

export const initialState: ProductStates = {
  products: [],
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
  isLoading: false,
  allProducts: []
}

export function productReducer(
  stateProduct: ProductStates,
  actionProduct: ProductClientActions
): ProductStates {
  switch (actionProduct.type) {
    case 'SET_LOADING':
      return { ...stateProduct, isLoading: actionProduct.payload }
    case 'SET_DATA':
      return { ...stateProduct, ...actionProduct.payload }
    default:
      return stateProduct
  }
}