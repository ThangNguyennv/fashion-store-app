import { fetchChangeStatusWithChildren, fetchDeleteArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllIdsInTree, getFamilyIds } from '~/helpers/updateStatusRecursiveForProduct'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateArticleCategory, dispatchArticleCategory, fetchArticleCategory } = useArticleCategoryContext()
  const { articleCategories, accounts, loading, pagination } = stateArticleCategory
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const urlParams = useMemo(() => ({
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
    keyword: searchParams.get('keyword') || '',
    sortKey: searchParams.get('sortKey') || '',
    sortValue: searchParams.get('sortValue') || ''
  }), [searchParams])

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }
  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }
  const reloadData = (): void => {
    fetchArticleCategory(urlParams)
  }
  const handleToggleStatus = async (currentStatus: string, id: string): Promise<void> => {
    // const currentUser: UpdatedBy = {
    //   account_id: myAccount ? myAccount._id : '',
    //   updatedAt: new Date()
    // }
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const response = await fetchChangeStatusWithChildren(newStatus, id)
    if (response.code === 200) {
      // const updatedAllArticlesCategory = stateArticleCategory.allArticleCategories.map(articleCategory =>
      //   articleCategory._id === id
      //     ? { ...articleCategory, status: newStatus, updatedBy: [...(articleCategory.updatedBy || []), currentUser] }
      //     : articleCategory
      // )
      // dispatchArticleCategory({
      //   type: 'SET_DATA',
      //   payload: {
      //     articleCategories: updateStatusRecursiveForArticle(articleCategories, id, newStatus, currentUser),
      //     allArticleCategories: updatedAllArticlesCategory
      //   }
      // })
      reloadData()
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
  }

  const handleDelete = async () => {
    if (!selectedId) return
    const response = await fetchDeleteArticleCategoryAPI(selectedId)
    if (response.code === 204) {
      // dispatchArticleCategory({
      //   type: 'SET_DATA',
      //   payload: {
      //     articleCategories: articleCategories.filter((articleCategory) => articleCategory._id != selectedId)
      //   }
      // })
      reloadData()
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpen(false)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  const handleCheckbox = (id: string, checked: boolean) => {
    // if (checked) {
    //   setSelectedIds((prev) => [...prev, id])
    // } else {
    //   setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    // }
    const idsToToggle = getFamilyIds(articleCategories, id)

    if (checked) {
      // Thêm vào danh sách selectedIds (sử dụng Set để tránh trùng lặp)
      setSelectedIds((prev) => {
        const uniqueIds = new Set([...prev, ...idsToToggle])
        return Array.from(uniqueIds)
      })
    } else {
      // Xóa các ID liên quan khỏi danh sách selectedIds
      setSelectedIds((prev) =>
        prev.filter((existingId) => !idsToToggle.includes(existingId))
      )
    }
  }
  const handleCheckAll = (checked: boolean) => {
    // if (checked) {
    //   const allIds = articleCategories
    //     .map((articleCategory) => articleCategory._id)
    //     .filter((id): id is string => id !== undefined)
    //   setSelectedIds(allIds)
    // } else {
    //   setSelectedIds([])
    // }
    if (checked) {
      const allIds = getAllIdsInTree(articleCategories)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }
  // Check all được bật khi số lượng selectedIds bằng tổng số node trong cây (chứ không phải length của mảng gốc)
  const totalNodes = useMemo(() => {
    return getAllIdsInTree(articleCategories).length
  }, [articleCategories])

  // const isCheckAll = (articleCategories.length > 0) && (selectedIds.length === articleCategories.length)
  const isCheckAll = (totalNodes > 0) && (selectedIds.length === totalNodes)

  return {
    loading,
    dispatchArticleCategory,
    articleCategories,
    accounts,
    handleToggleStatus,
    handleDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    open,
    handleOpen,
    handleClose,
    pagination
  }
}

