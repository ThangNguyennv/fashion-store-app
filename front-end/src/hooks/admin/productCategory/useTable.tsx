import { fetchChangeStatusWithChildren, fetchDeleteProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import { getAllIdsInTree, getFamilyIds } from '~/helpers/getId.helper'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProductCategory, dispatchProductCategory, fetchProductCategory } = useProductCategoryContext()
  const { productCategories, accounts, loading, pagination } = stateProductCategory
  const [searchParams] = useSearchParams()
  // const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()
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
    fetchProductCategory(urlParams)
  }

  const handleToggleStatus = async (currentStatus: string, id: string): Promise<void> => {
    // const currentUser: UpdatedBy = {
    //   account_id: myAccount ? myAccount._id : '',
    //   updatedAt: new Date()
    // }
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const response = await fetchChangeStatusWithChildren(newStatus, id)
    // const updatedAllProductsCategory = stateProductCategory.allProductCategories.map(productCategory =>
    //   productCategory._id === id
    //     ? { ...productCategory, status: newStatus, updatedBy: [...(productCategory.updatedBy || []), currentUser] }
    //     : productCategory
    // )

    if (response.code === 200) {
      // dispatchProductCategory({
      //   type: 'SET_DATA',
      //   payload: {
      //     productCategories: updateStatusRecursiveForProduct(productCategories, id, newStatus, currentUser),
      //     allProductCategories: updatedAllProductsCategory
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
    const response = await fetchDeleteProductCategoryAPI(selectedId)
    if (response.code === 204) {
      // dispatchProductCategory({
      //   type: 'SET_DATA',
      //   payload: {
      //     productCategories: productCategories.filter((productCategory) => productCategory._id != selectedId)
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

  // const handleCheckbox = (id: string, checked: boolean) => {
  //   if (checked) {
  //     setSelectedIds((prev) => [...prev, id])
  //   } else {
  //     setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
  //   }
  // }
  const handleCheckbox = (id: string, checked: boolean) => {
    // 1. Lấy danh sách ID của thằng được click và toàn bộ con cháu của nó
    const idsToToggle = getFamilyIds(productCategories, id)

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

  // const handleCheckAll = (checked: boolean) => {
  //   if (checked) {
  //     const allIds = productCategories
  //       .map((productCategory) => productCategory._id)
  //       .filter((id): id is string => id !== undefined)

  //     setSelectedIds(allIds)
  //   } else {
  //     setSelectedIds([])
  //   }
  // }
  // Check All (Phải lấy hết ID trong cây, không chỉ root)
  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      const allIds = getAllIdsInTree(productCategories)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }
  // Check all được bật khi số lượng selectedIds bằng tổng số node trong cây (chứ không phải length của mảng gốc)
  const totalNodes = useMemo(() => {
    return getAllIdsInTree(productCategories).length
  }, [productCategories])

  // const isCheckAll = (productCategories.length > 0) && (selectedIds.length === productCategories.length)
  const isCheckAll = (totalNodes > 0) && (selectedIds.length === totalNodes)

  return {
    loading,
    dispatchProductCategory,
    productCategories,
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

