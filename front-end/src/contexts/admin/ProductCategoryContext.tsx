/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { fetchAllProductCategoriesAPI } from '~/apis/admin/productCategory.api'
import { initialState, productCategoryReducer } from '~/reducers/admin/productCategoryReducer'
import type { ProductCategoryActions, ProductCategoryAPIResponse, ProductCategoryStates } from '~/types/productCategory.type'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { AllParams } from '~/types/helper.type'

interface ProductCategoryContextType {
  stateProductCategory: ProductCategoryStates
  dispatchProductCategory: React.Dispatch<ProductCategoryActions>
  fetchProductCategory: (params?: AllParams) => Promise<void>
}

const ProductCategoryContext = createContext<ProductCategoryContextType | null>(null)

export const ProductCategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateProductCategory, dispatchProductCategory] = useReducer(productCategoryReducer, initialState)
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  const fetchProductCategory = useCallback(
    async (params: AllParams = {}) => {
      dispatchProductCategory({ type: 'SET_LOADING', payload: true })
      try {
        const res: ProductCategoryAPIResponse = await fetchAllProductCategoriesAPI(params)
        dispatchProductCategory({
          type: 'SET_DATA',
          payload: {
            productCategories: res.productCategories,
            allProductCategories: res.allProductCategories,
            accounts: res.accounts,
            pagination: res.pagination,
            filterStatus: res.filterStatus,
            keyword: res.keyword,
            sortKey: params.sortKey || '',
            sortValue: params.sortValue || ''
          }
        })
      } catch (error) {
        console.error('Error fetching ProductCategory:', error)
      } finally {
        dispatchProductCategory({ type: 'SET_LOADING', payload: false })
      }
    }, [])

  // Gọi APi của product-category để xài bên các trang khác
  useEffect(() => {
    //  Chỉ gọi API khi đã xác thực VÀ AuthContext không còn loading
    if (isAuthLoading || !isAuthenticated) {
      // Nếu chưa xác thực hoặc đang load auth, thoát khỏi useEffect
      return
    }
    fetchProductCategory()
  }, [fetchProductCategory, isAuthLoading, isAuthenticated])

  return (
    <ProductCategoryContext.Provider value={{ stateProductCategory, fetchProductCategory, dispatchProductCategory }}>
      {children}
    </ProductCategoryContext.Provider>
  )
}

export const useProductCategoryContext = () => {
  const context = useContext(ProductCategoryContext)
  if (!context) throw new Error('useProductCategoryContext must be used inside ProductCategoryProvider')
  return context
}