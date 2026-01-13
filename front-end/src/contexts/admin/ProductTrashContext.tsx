/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchProductTrashAPI } from '~/apis/admin/product.api'
import { initialState } from '~/reducers/admin/productReducer'
import { productReducer } from '~/reducers/admin/productReducer'
import type { AllParams } from '~/interfaces/helper.interface'
import type { ProductActions, ProductAPIResponse, ProductStates } from '~/interfaces/product.interface'

interface ProductTrashContextType {
  stateProduct: ProductStates
  fetchProductTrash: (params?: AllParams) => Promise<void>
  dispatchProduct: React.Dispatch<ProductActions>
}

const ProductTrashContext = createContext<ProductTrashContextType | null>(null)

export const ProductTrashAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProduct, dispatchProduct] = useReducer(productReducer, initialState)

  const fetchProductTrash = useCallback(
    async (params: AllParams = {}) => {
      dispatchProduct({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductAPIResponse = await fetchProductTrashAPI(params)
        dispatchProduct({
          type: 'SET_DATA',
          payload: {
            products: res.products,
            allProducts: res.allProducts,
            pagination: res.pagination,
            keyword: res.keyword,
            sortKey: params.sortKey || '',
            sortValue: params.sortValue || ''
          }
        })
      } finally {
        dispatchProduct({ type: 'SET_LOADING', payload: false })
      }
    }, [])

  return (
    <ProductTrashContext.Provider value={{ stateProduct, fetchProductTrash, dispatchProduct }}>
      {children}
    </ProductTrashContext.Provider>
  )
}

export const useProductTrashContext = () => {
  const context = useContext(ProductTrashContext)
  if (!context) throw new Error('useProductTrashContext must be used inside ProductProvider')
  return context
}