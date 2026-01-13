/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { fetchOrdersAPI } from '~/apis/client/order.api'
import { initialState, orderReducer } from '~/reducers/client/orderReducer'
import type { AllParams } from '~/interfaces/helper.interface'
import type { OrderAction, OrderAPIResponse, OrderState } from '~/interfaces/order.interface'

interface OrderContextType {
  stateOrder: OrderState
  fetchOrder: (params?: AllParams) => Promise<void>
  dispatchOrder: React.Dispatch<OrderAction>
}

const OrderContext = createContext<OrderContextType | null>(null)

export const OrderClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [stateOrder, dispatchOrder] = useReducer(orderReducer, initialState)

  const fetchOrder = useCallback(
    async (params: AllParams = {}) => {
      dispatchOrder({ type: 'SET_LOADING', payload: true })
      try {
        const res: OrderAPIResponse = await fetchOrdersAPI(params)
        dispatchOrder({
          type: 'SET_DATA',
          payload: {
            orders: res.orders,
            pagination: res.pagination,
            keyword: res.keyword,
            sortKey: params.sortKey || '',
            sortValue: params.sortValue || '',
            date: params.date || ''
          }
        })
      } finally {
        dispatchOrder({ type: 'SET_LOADING', payload: false })
      }
    }, [])
  return (
    <OrderContext.Provider value={{ stateOrder, fetchOrder, dispatchOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrderContext must be used inside OrderProvider')
  return context
}