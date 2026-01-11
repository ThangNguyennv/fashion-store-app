import { fetchPermanentlyDeleteOrderAPI, fetchRecoverOrderAPI } from '~/apis/admin/order.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useState } from 'react'
import { useOrderTrashContext } from '~/contexts/admin/OrderTrashContext'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTableTrash = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateOrder, dispatchOrder } = useOrderTrashContext()
  const { orders, loading, pagination } = stateOrder
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

    const response = await fetchPermanentlyDeleteOrderAPI(selectedIdPermanentlyDelete)
    if (response.code === 204) {
      dispatchOrder({
        type: 'SET_DATA',
        payload: {
          orders: orders.filter((order) => order._id !== selectedIdPermanentlyDelete)
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

    const response = await fetchRecoverOrderAPI(id)
    if (response.code === 200) {
      dispatchOrder({
        type: 'SET_DATA',
        payload: {
          orders: orders.filter((order) => order._id !== id)
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
      const allIds = orders.map((order) => order._id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  const isCheckAll = (orders.length > 0) && (selectedIds.length === orders.length)

  return {
    orders,
    loading,
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