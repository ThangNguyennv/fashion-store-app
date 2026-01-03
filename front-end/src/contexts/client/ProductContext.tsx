/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchProductAPI } from '~/apis/client/product.api'
import { initialState } from '~/reducers/client/productReducer'
import { productReducer } from '~/reducers/client/productReducer'
import type { AllParams } from '~/types/helper.type'
import type { ProductAPIResponse, ProductClientActions, ProductStates } from '~/types/product.type'

interface ProductContextType {
  stateProduct: ProductStates
  fetchProduct: (params?: AllParams) => Promise<void>
  dispatchProduct: React.Dispatch<ProductClientActions>
}

const ProductContext = createContext<ProductContextType | null>(null)

export const ProductClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProduct, dispatchProduct] = useReducer(productReducer, initialState)

  const fetchProduct = useCallback(
    // 3. Cập nhật tham số đầu vào
    async (params: AllParams = {}) => {
      dispatchProduct({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductAPIResponse = await fetchProductAPI(params)

        dispatchProduct({
          type: 'SET_DATA',
          payload: {
            products: res.products,
            allProducts: res.allProducts,
            pagination: res.pagination,
            keyword: res.keyword,
            sortKey: params.sortKey || '',
            sortValue: params.sortValue || '',
            category: params.category || '',
            maxPrice: params.maxPrice || '',
            color: params.color || '',
            size: params.size || ''
          }
        })
      } finally {
        dispatchProduct({ type: 'SET_LOADING', payload: false })
      }
    }, [])

  return (
    <ProductContext.Provider value={{ stateProduct, fetchProduct, dispatchProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProductContext must be used inside ProductProvider')
  return context
}

