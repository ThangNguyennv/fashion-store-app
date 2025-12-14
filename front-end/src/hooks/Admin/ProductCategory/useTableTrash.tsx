import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useState } from 'react'
import { useProductCategoryTrashContext } from '~/contexts/admin/ProductCategoryTrashContext'
import { fetchPermanentlyDeleteProductCategoryAPI, fetchRecoverProductCategoryAPI } from '~/apis/admin/productCategory.api'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTableTrash = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProductCategory, dispatchProductCategory } = useProductCategoryTrashContext()
  const { productCategories, accounts, loading } = stateProductCategory

  const { dispatchAlert } = useAlertContext()
  const [openPermanentlyDelete, setOpenPermanentlyDelete] = useState(false)
  const [selectedIdPermanentlyDelete, setSelectedIdPermanentlyDelete] = useState<string | null>(null)

  const handleOpenPermanentlyDelete = (id: string) => {
    setSelectedIdPermanentlyDelete(id)
    setOpenPermanentlyDelete(true)
  }

  const handleClosePermanentlyDelete = () => {
    setSelectedIdPermanentlyDelete(null)
    setOpenPermanentlyDelete(false)
  }

  const handlePermanentlyDelete = async () => {
    if (!selectedIdPermanentlyDelete) return

    const response = await fetchPermanentlyDeleteProductCategoryAPI(selectedIdPermanentlyDelete)
    if (response.code === 204) {
      dispatchProductCategory({
        type: 'SET_DATA',
        payload: {
          productCategories: productCategories.filter((productCategory) => productCategory._id !== selectedIdPermanentlyDelete)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpenPermanentlyDelete(false)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  const handleRecover = async (id: string) => {
    if (!id) return

    const response = await fetchRecoverProductCategoryAPI(id)
    if (response.code === 200) {
      dispatchProductCategory({
        type: 'SET_DATA',
        payload: {
          productCategories: productCategories.filter((productCategory) => productCategory._id !== id)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  const handleCheckbox = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      const allIds = productCategories
        .map((productCategory) => productCategory._id)
        .filter((id): id is string => id !== undefined)

      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }
  const isCheckAll = (productCategories.length > 0) && (selectedIds.length === productCategories.length)

  return {
    loading,
    productCategories,
    accounts,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    open,
    handleOpenPermanentlyDelete,
    handleClosePermanentlyDelete,
    handleRecover,
    handlePermanentlyDelete,
    openPermanentlyDelete,
    dispatchProductCategory
  }
}

