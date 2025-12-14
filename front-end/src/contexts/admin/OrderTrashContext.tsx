/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchOrderTrashAPI } from '~/apis/admin/order.api'
import { initialOrderState, orderReducer } from '~/reducers/admin/orderReducer'
import type { AllParams } from '~/types/helper.type'
import type { OrderAction, OrderAPIResponse, OrderState } from '~/types/order.type'

interface OrderTrashContextType {
  stateOrder: OrderState
  dispatchOrder: React.Dispatch<OrderAction>
  fetchOrdersTrash: (params?: AllParams) => Promise<void>
  resetOrders: () => void
}

const OrderTrashContext = createContext<OrderTrashContextType | null>(null)

export const OrderTrashProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateOrder, dispatchOrder] = useReducer(orderReducer, initialOrderState)

  const fetchOrdersTrash = useCallback(async (params: AllParams = {}) => {
    dispatchOrder({ type: 'SET_LOADING', payload: true })

    try {
      const res: OrderAPIResponse = await fetchOrderTrashAPI(params)
      if (res.code !== 200) {
        throw new Error(res.message || 'Có lỗi xảy ra')
      }
      dispatchOrder({
        type: 'SET_DATA',
        payload: {
          orders: res.orders,
          accounts: res.accounts,
          pagination: res.pagination,
          keyword: res.keyword,
          sortKey: params.sortKey || '',
          sortValue: params.sortValue || ''
        }
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      dispatchOrder({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const resetOrders = useCallback(() => {
    dispatchOrder({ type: 'RESET' })
  }, [])

  return (
    <OrderTrashContext.Provider value={{ stateOrder, fetchOrdersTrash, dispatchOrder, resetOrders }}>
      {children}
    </OrderTrashContext.Provider>
  )
}

export const useOrderTrashContext = () => {
  const context = useContext(OrderTrashContext)
  if (!context) throw new Error('useOrderTrashContext must be used inside OrderProvider')
  return context
}