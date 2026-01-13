/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchOrdersAPI } from '~/apis/admin/order.api'
import { initialOrderState, orderReducer } from '~/reducers/admin/orderReducer'
import type { AllParams } from '~/interfaces/helper.interface'
import type { OrderAction, OrderAPIResponse, OrderState } from '~/interfaces/order.interface'

interface OrderContextType {
  stateOrder: OrderState
  dispatchOrder: React.Dispatch<OrderAction>
  fetchOrders: (params?: AllParams) => Promise<void>
}

const OrderContext = createContext<OrderContextType | null>(null)

export const OrderAdminProvider = ({ children }: { children: React.ReactNode }) => {
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
          allOrders: res.allOrders,
          pagination: res.pagination,
          filterOrder: res.filterOrder,
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

  return (
    <OrderContext.Provider value={{ stateOrder, fetchOrders, dispatchOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrderContext must be used inside OrderProvider')
  return context
}