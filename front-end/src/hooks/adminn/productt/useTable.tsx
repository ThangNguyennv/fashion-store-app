import { fetchChangeStatusAPI, fetchDeleteProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductContext } from '~/contexts/admin/ProductContext'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateProduct, dispatchProduct } = useProductContext()
  const { products, isLoading, pagination } = stateProduct
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedId) return

    const response = await fetchDeleteProductAPI(selectedId)
    if (response.code === 204) {
      dispatchProduct({
        type: 'SET_DATA',
        payload: {
          products: products.filter((product) => product._id !== selectedId)
        }
      })
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

  const handleToggleStatus = async (id: string, currentStatus: string): Promise<void> => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const response = await fetchChangeStatusAPI(newStatus, id)
    if (response.code === 200) {
      const updateProduct = response
      const updatedAllProducts = stateProduct.allProducts.map(product =>
        product._id === id
          ? updateProduct.updater
          : product
      )
      const updatedProducts = stateProduct.products.map(product =>
        product._id === id
          ? updateProduct.updater
          : product
      )
      dispatchProduct({
        type: 'SET_DATA',
        payload: {
          products: updatedProducts,
          allProducts: updatedAllProducts
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
    currentStatus,
    products,
    isLoading,
    dispatchProduct,
    handleToggleStatus,
    open,
    handleOpen,
    handleClose,
    handleDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    selectedId,
    pagination
  }
}