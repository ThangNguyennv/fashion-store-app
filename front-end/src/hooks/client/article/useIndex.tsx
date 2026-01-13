import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useArticleContext } from '~/contexts/client/ArticleContext'
import type { AllParams } from '~/interfaces/helper.interface'

const useIndex = () => {
  const { stateArticle, fetchArticle } = useArticleContext()
  const { articles, pagination, loading } = stateArticle
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse URL params một lần
  const urlParams = useMemo(() => ({
    page: parseInt(searchParams.get('page') || '1', 10),
    keyword: searchParams.get('keyword') || '',
    sortKey: searchParams.get('sortKey') || '',
    sortValue: searchParams.get('sortValue') || ''
  }), [searchParams])

  useEffect(() => {
    fetchArticle(urlParams)
  }, [urlParams.page, urlParams.keyword, urlParams.sortKey, urlParams.sortValue, fetchArticle, urlParams])

  const updateParams = useCallback((params: Partial<AllParams>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newParams.set(key, value.toString())
      } else {
        newParams.delete(key)
      }
    })
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  return {
    articles,
    pagination,
    updateParams,
    loading
  }
}

export default useIndex