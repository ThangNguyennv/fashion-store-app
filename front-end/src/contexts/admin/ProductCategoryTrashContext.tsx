/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchProductCategoryTrashAPI } from '~/apis/admin/productCategory.api'
import { initialState, productCategoryReducer } from '~/reducers/admin/productCategoryReducer'
import type { ProductCategoryActions, ProductCategoryAPIResponse, ProductCategoryStates } from '~/types/productCategory.type'
import type { AllParams } from '~/types/helper.type'

interface ProductCategoryTrashContextType {
  stateProductCategory: ProductCategoryStates
  dispatchProductCategory: React.Dispatch<ProductCategoryActions>
  fetchProductCategoryTrash: (params?: AllParams) => Promise<void>
}

const ProductCategoryTrashContext = createContext<ProductCategoryTrashContextType | null>(null)

export const ProductCategoryTrashAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProductCategory, dispatchProductCategory] = useReducer(productCategoryReducer, initialState)

  const fetchProductCategoryTrash = useCallback(
    async (params: AllParams = {}) => {
      dispatchProductCategory({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductCategoryAPIResponse = await fetchProductCategoryTrashAPI(params)
        dispatchProductCategory({
          type: 'SET_DATA',
          payload: {
            productCategories: res.productCategories,
            accounts: res.accounts,
            pagination: res.pagination,
            keyword: res.keyword,
            sortKey: params.sortKey || '',
            sortValue: params.sortValue || ''
          }
        })
      } catch (error) {
        console.error('Error fetching ProductCategoryTrash:', error)
      } finally {
        dispatchProductCategory({ type: 'SET_LOADING', payload: false })
      }
    }, [])

  return (
    <ProductCategoryTrashContext.Provider value={{ stateProductCategory, fetchProductCategoryTrash, dispatchProductCategory }}>
      {children}
    </ProductCategoryTrashContext.Provider>
  )
}

export const useProductCategoryTrashContext = () => {
  const context = useContext(ProductCategoryTrashContext)
  if (!context) throw new Error('useProductCategoryTrashContext must be used inside ProductCategoryProvider')
  return context
}