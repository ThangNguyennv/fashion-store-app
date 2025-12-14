import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchChangeMultiAPI } from '~/apis/admin/order.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useOrderContext } from '~/contexts/admin/OrderContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { OrderStatus } from '~/types/order.type'
import type { AllParams } from '~/types/helper.type'

export const useOrder = () => {
  const { stateOrder, fetchOrders, dispatchOrder } = useOrderContext()
  const { orders, pagination, filterOrder, keyword, allOrders } = stateOrder
  const { role } = useAuth()
  const { dispatchAlert } = useAlertContext()
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
    fetchOrders(urlParams)
  }, [urlParams.status, urlParams.page, urlParams.keyword, urlParams.sortKey, urlParams.sortValue, fetchOrders, urlParams])

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

  const reloadData = (): void => {
    fetchOrders(urlParams)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    const typeChange = actionType
    if (selectedIds.length === 0) {
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

    if (typeChange === 'delete-all') {
      setPendingAction('delete-all')
      setOpen(true)
      return
    }
    await executeAction(typeChange)
  }

  const executeAction = async (typeChange: string) => {
    const selectedOrders = orders.filter(order =>
      selectedIds.includes(order._id)
    )

    let result: string[] = []
    result = selectedOrders.map(order => order._id)

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
    // Refetch
    reloadData()
  }
  const handleConfirmDeleteAll = async () => {
    if (pendingAction === 'delete-all') {
      await executeAction('delete-all')
    }
    setOpen(false)
  }

  const handleSort = useCallback((event: ChangeEvent<HTMLSelectElement>): void => {
    const [sortKey, sortValue] = event.currentTarget.value.split('-')
    updateParams({ sortKey, sortValue, page: 1 })
  }, [updateParams])

  const clearSortParams = (): void => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('sortKey')
    newParams.delete('sortValue')
    setSearchParams(newParams)
  }

  const handleFilterStatus = useCallback((status: OrderStatus) => {
    updateParams({ status, page: 1 })
  }, [updateParams])

  return {
    dispatchOrder,
    orders,
    filterOrder,
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
    open,
    handleClose,
    handleConfirmDeleteAll,
    role,
    allOrders
  }
}