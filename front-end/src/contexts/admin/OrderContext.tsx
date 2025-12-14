/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchOrdersAPI } from '~/apis/admin/order.api'
import { initialOrderState, orderReducer } from '~/reducers/admin/orderReducer'
import type { AllParams } from '~/types/helper.type'
import type { OrderAction, OrderAPIResponse, OrderState } from '~/types/order.type'

interface OrderContextType {
  stateOrder: OrderState
  dispatchOrder: React.Dispatch<OrderAction>
  fetchOrders: (params?: AllParams) => Promise<void>
  resetOrders: () => void
}

const OrderContext = createContext<OrderContextType | null>(null)

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateOrder, dispatchOrder] = useReducer(orderReducer, initialOrderState)

  const fetchOrders = useCallback(async (params: AllParams = {}) => {
    dispatchOrder({ type: 'SET_LOADING', payload: true })

    try {
      const res: OrderAPIResponse = await fetchOrdersAPI(params)
      if (res.code !== 200) {
        throw new Error(res.message || 'Có lỗi xảy ra')
      }
      dispatchOrder({
        type: 'SET_DATA',
        payload: {
          orders: res.orders,
          accounts: res.accounts,
          pagination: res.pagination,
          filterOrder: res.filterOrder,
          allOrders: res.allOrders,
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
    <OrderContext.Provider value={{ stateOrder, fetchOrders, dispatchOrder, resetOrders }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrderContext must be used inside OrderProvider')
  return context
}