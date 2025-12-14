import { fetchChangeStatusAPI, fetchDeleteOrderAPI, fetchPermanentlyDeleteOrderAPI, fetchRecoverOrderAPI } from '~/apis/admin/order.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { UpdatedBy } from '~/types/helper.type'
import { useState } from 'react'
import { useOrderContext } from '~/contexts/admin/OrderContext'
import type { OrderStatus } from '~/types/order.type'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateOrder, dispatchOrder } = useOrderContext()
  const { orders, accounts, loading, pagination } = stateOrder
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()
  const [open, setOpen] = useState(false)
  const [openPermanentlyDelete, setOpenPermanentlyDelete] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIdPermanentlyDelete, setSelectedIdPermanentlyDelete] = useState<string | null>(null)

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleOpenPermanentlyDelete = (id: string) => {
    setSelectedIdPermanentlyDelete(id)
    setOpenPermanentlyDelete(true)
  }

  const handleClosePermanentlyDelete = () => {
    setSelectedIdPermanentlyDelete(null)
    setOpenPermanentlyDelete(false)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
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
      setOpen(false)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return

    const response = await fetchDeleteOrderAPI(selectedId)
    if (response.code === 204) {
      dispatchOrder({
        type: 'SET_DATA',
        payload: {
          orders: orders.filter((order) => order._id !== selectedId)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpen(false)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
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
      setOpen(false)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  const handleChangeStatus = async (id: string, newStatus: OrderStatus): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount ? myAccount._id : '',
      updatedAt: new Date()
    }

    const response = await fetchChangeStatusAPI(newStatus, id)
    if (response.code === 200) {
      const updatedAllOrders = (stateOrder.allOrders ?? []).map(order =>
        order._id === id
          ? { ...order, status: newStatus, updatedBy: [...(order.updatedBy || []), currentUser] }
          : order
      )
      const updatedOrders = (stateOrder.allOrders ?? []).map(order =>
        order._id === id
          ? { ...order, status: newStatus, updatedBy: [...(order.updatedBy || []), currentUser] }
          : order
      )
      dispatchOrder({
        type: 'SET_DATA',
        payload: {
          orders: updatedOrders,
          allOrders: updatedAllOrders
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
    handleChangeStatus,
    open,
    openPermanentlyDelete,
    handleOpen,
    handleClose,
    handleOpenPermanentlyDelete,
    handleClosePermanentlyDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    accounts,
    handleDelete,
    handleRecover,
    handlePermanentlyDelete,
    pagination
  }
}