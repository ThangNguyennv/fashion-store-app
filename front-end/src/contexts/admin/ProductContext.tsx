/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchProductAPI } from '~/apis/admin/product.api'
import { initialState } from '~/reducers/admin/productReducer'
import { productReducer } from '~/reducers/admin/productReducer'
import type { AllParams } from '~/types/helper.type'
import type { ProductActions, ProductAPIResponse, ProductStates } from '~/types/product.type'
import { useAlertContext } from '../alert/AlertContext'
import { useNavigate } from 'react-router-dom'

interface ProductContextType {
  stateProduct: ProductStates
  fetchProduct: (params?: AllParams) => Promise<void>
  dispatchProduct: React.Dispatch<ProductActions>
}

const ProductContext = createContext<ProductContextType | null>(null)

export const ProductAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProduct, dispatchProduct] = useReducer(productReducer, initialState)
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  const fetchProduct = useCallback(
    async (params: AllParams = {}) => {
      dispatchProduct({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductAPIResponse = await fetchProductAPI(params)
        if (res.code === 403) {
          dispatchAlert({
            type: 'SHOW_ALERT',
            payload: { message: res.message, severity: 'error' }
          })
          navigate('/admin/products')
          return
        }
        dispatchProduct({
          type: 'SET_DATA',
          payload: {
            products: res.products,
            allProducts: res.allProducts,
            pagination: res.pagination,
            filterStatus: res.filterStatus,
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