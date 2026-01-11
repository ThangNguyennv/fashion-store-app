import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useState } from 'react'
import { useProductTrashContext } from '~/contexts/admin/ProductTrashContext'
import { fetchPermanentlyDeleteProductAPI, fetchRecoverProductAPI } from '~/apis/admin/product.api'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTrashTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProduct, dispatchProduct } = useProductTrashContext()
  const { products, isLoading, pagination } = stateProduct
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

    const response = await fetchPermanentlyDeleteProductAPI(selectedIdPermanentlyDelete)
    if (response.code === 204) {
      dispatchProduct({
        type: 'SET_DATA',
        payload: {
          products: products.filter((product) => product._id !== selectedIdPermanentlyDelete)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpenPermanentlyDelete(false)
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  const handleRecover = async (id: string) => {
    if (!id) return

    const response = await fetchRecoverProductAPI(id)
    if (response.code === 200) {
      dispatchProduct({
        type: 'SET_DATA',
        payload: {
          products: products.filter((product) => product._id !== id)
        }
      })
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

  const handleCheckbox = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      const allIds = products
        .map((product) => product._id)
        .filter((id): id is string => id !== undefined)

      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  const isCheckAll = (products.length > 0) && (selectedIds.length === products.length)

  return {
    products,
    isLoading,
    openPermanentlyDelete,
    handleOpenPermanentlyDelete,
    handleClosePermanentlyDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    handleRecover,
    handlePermanentlyDelete,
    pagination
  }
}