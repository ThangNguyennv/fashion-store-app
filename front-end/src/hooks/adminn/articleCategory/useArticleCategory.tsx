import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchChangeMultiAPI } from '~/apis/admin/articleCategory.api'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AllParams } from '~/types/helper.type'

export const useArticleCategory = () => {
  const { stateArticleCategory, fetchArticleCategory, dispatchArticleCategory } = useArticleCategoryContext()
  const { articleCategories, filterStatus, pagination, keyword, allArticleCategories } = stateArticleCategory
  const { dispatchAlert } = useAlertContext()
  const { role } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [actionType, setActionType] = useState('')
  const [open, setOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  // Parse URL params một lần
  const urlParams = useMemo(() => ({
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
    keyword: searchParams.get('keyword') || '',
    sortKey: searchParams.get('sortKey') || '',
    sortValue: searchParams.get('sortValue') || ''
  }), [searchParams])

  useEffect(() => {
    fetchArticleCategory(urlParams)
  }, [urlParams.status, urlParams.page, urlParams.keyword, urlParams.sortKey, urlParams.sortValue, urlParams, fetchArticleCategory])

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

  const reloadData = () => {
    fetchArticleCategory(urlParams)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const typeChange = actionType

    if (!selectedIds.length) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn ít nhất một bản ghi!', severity: 'error' }
      })
      return
    }
    if (!typeChange) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Vui lòng chọn hành động!', severity: 'error' }
      })
      return
    }
    if (typeChange === 'DELETEALL') {
      setPendingAction('DELETEALL')
      setOpen(true)
      return
    }
    await executeAction(typeChange)
  }
  const executeAction = async (typeChange: string) => {
    // const selectedArticlesCategory = articleCategories.filter(articleCategory => selectedIds.includes(articleCategory._id as string))

    // const result: string[] = selectedArticlesCategory
    //   .map(articleCategory => articleCategory._id)
    //   .filter((id): id is string => typeof id === 'string')
    const result = selectedIds

    const response = await fetchChangeMultiAPI({ ids: result, type: typeChange })

    if ([200, 204].includes(response.code)) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }

    setSelectedIds([])
    setActionType('')
    setPendingAction(null)

    reloadData()
  }

  const handleConfirmDeleteAll = async () => {
    if (pendingAction === 'DELETEALL') {
      await executeAction('DELETEALL')
    }
    setOpen(false)
  }

  const handleSort = useCallback((event: ChangeEvent<HTMLSelectElement>): void => {
    const [sortKey, sortValue] = event.currentTarget.value.split('-')
    updateParams({ sortKey, sortValue, page: 1 })
  }, [updateParams])

  const clearSortParams = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('sortKey')
    newParams.delete('sortValue')
    setSearchParams(newParams)
  }

  const handleFilterStatus = useCallback((status: string) => {
    const urlFriendlyStatus = status.toLowerCase()
    updateParams({ status: urlFriendlyStatus, page: 1 })
  }, [updateParams])

  return {
    dispatchArticleCategory,
    filterStatus,
    pagination,
    keyword,
    sortKey: urlParams.sortKey,
    sortValue: urlParams.sortValue,
    selectedIds,
    setSelectedIds,
    actionType,
    setActionType,
    status: urlParams.status,
    updateParams,
    handleSubmit,
    handleSort,
    clearSortParams,
    handleFilterStatus,
    articleCategories,
    role,
    allArticleCategories,
    handleConfirmDeleteAll,
    handleClose,
    open
  }
}