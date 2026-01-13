import { fetchChangeStatusAPI, fetchDeleteOrderAPI } from '~/apis/admin/order.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { FilterStatusInterface } from '~/interfaces/helper.interface'
import { useState } from 'react'
import { useOrderContext } from '~/contexts/admin/OrderContext'
import type { OrderStatus } from '~/interfaces/order.interface'

export interface Props {
  filterOrder: FilterStatusInterface[]
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateOrder, dispatchOrder } = useOrderContext()
  const { orders, loading, pagination } = stateOrder
  const { dispatchAlert } = useAlertContext()
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
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  const handleChangeStatus = async (id: string, newStatus: OrderStatus): Promise<void> => {

    const response = await fetchChangeStatusAPI(newStatus, id)
    if (response.code === 200) {
      const updatedOrder = response
      const updatedAllOrders = (stateOrder.allOrders ?? []).map(order =>
        order._id === id
          ? updatedOrder.updater
          : order
      )
      const updatedOrders = (stateOrder.orders ?? []).map(order =>
        order._id === id
          ? updatedOrder.updater
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
    handleChangeStatus,
    open,
    handleOpen,
    handleClose,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    handleDelete,
    pagination
  }
}