/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { initialState, articleCategoryReducer } from '~/reducers/admin/articleCategory'
import type { ArticleCategoryActions, ArticleCategoryAPIResponse, ArticleCategoryStates } from '~/interfaces/articleCategory.interface'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { AllParams } from '~/interfaces/helper.interface'
import { fetchArticleCategoryAPI } from '~/apis/admin/articleCategory.api'

interface ArticleCategoryContextType {
  stateArticleCategory: ArticleCategoryStates
  fetchArticleCategory: (params?: AllParams) => Promise<void>
  dispatchArticleCategory: React.Dispatch<ArticleCategoryActions>
}

const ArticleCategoryContext = createContext<ArticleCategoryContextType | null>(null)

export const ArticleCategoryAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateArticleCategory, dispatchArticleCategory] = useReducer(articleCategoryReducer, initialState)
  const { isAuthenticated, isLoading } = useAuth()
  const isAuthLoading = isLoading

  const fetchArticleCategory = useCallback(
    async (params: AllParams = {}) => {
      dispatchArticleCategory({ type: 'SET_LOADING', payload: true })
      try {
        const res: ArticleCategoryAPIResponse = await fetchArticleCategoryAPI(params)
        dispatchArticleCategory({
          type: 'SET_DATA',
          payload: {
            articleCategories: res.articleCategories,
            allArticleCategories: res.allArticleCategories,
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
        dispatchArticleCategory({ type: 'SET_LOADING', payload: false })
      }
    }, [])

  // Gọi APi của article-category bên các trang khác
  useEffect(() => {
    //  Chỉ gọi API khi đã xác thực VÀ AuthContext không còn loading
    if (isAuthLoading || !isAuthenticated) {
      // Nếu chưa xác thực hoặc đang load auth, thoát khỏi useEffect
      return
    }
    fetchArticleCategory()
  }, [fetchArticleCategory, isAuthLoading, isAuthenticated])

  return (
    <ArticleCategoryContext.Provider value={{ stateArticleCategory, fetchArticleCategory, dispatchArticleCategory }}>
      {children}
    </ArticleCategoryContext.Provider>
  )
}

export const useArticleCategoryContext = () => {
  const context = useContext(ArticleCategoryContext)
  if (!context) throw new Error('useArticleCategoryContext must be used inside ArticleCategoryProvider')
  return context
}