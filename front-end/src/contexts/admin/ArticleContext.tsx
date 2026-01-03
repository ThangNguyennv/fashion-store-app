/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchArticleAPI } from '~/apis/admin/article.api'
import { articleReducer } from '~/reducers/admin/articleReducer'
import { initialState } from '~/reducers/admin/articleReducer'
import type { ArticleActions, ArticleAPIResponse, ArticleStates } from '~/types/article.type'
import type { AllParams } from '~/types/helper.type'

interface ArticleContextType {
  stateArticle: ArticleStates
  fetchArticle: (params?: AllParams) => Promise<void>
  dispatchArticle: React.Dispatch<ArticleActions>
}

const ArticleContext = createContext<ArticleContextType | null>(null)

export const ArticleAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateArticle, dispatchArticle] = useReducer(articleReducer, initialState)

  const fetchArticle = useCallback(
    async (params: AllParams = {}) => {
      dispatchArticle({ type: 'SET_LOADING', payload: true })
      try {
        const res: ArticleAPIResponse = await fetchArticleAPI(params)
        dispatchArticle({
          type: 'SET_DATA',
          payload: {
            articles: res.articles,
            pagination: res.pagination,
            filterStatus: res.filterStatus,
            allArticles: res.allArticles,
            keyword: res.keyword,
            sortKey: params.sortKey || '',
            sortValue: params.sortValue || ''
          }
        })
      } finally {
        dispatchArticle({ type: 'SET_LOADING', payload: false })
      }
    }, [])

  return (
    <ArticleContext.Provider value={{ stateArticle, fetchArticle, dispatchArticle }}>
      {children}
    </ArticleContext.Provider>
  )
}

export const useArticleContext = () => {
  const context = useContext(ArticleContext)
  if (!context) throw new Error('useArticleContext must be used inside ArticleProvider')
  return context
}