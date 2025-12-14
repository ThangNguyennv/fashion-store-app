/* eslint-disable indent */
import type { OrderAction, OrderState } from '~/types/order.type'

export const initialOrderState: OrderState = {
  orders: [],
  accounts: [],
  allOrders: [],
  filterOrder: [],
  pagination: {
    currentPage: 1,
    limitItems: 10,
    skip: 0,
    totalPage: 0
  },
  keyword: '',
  sortKey: '',
  sortValue: '',
  loading: false,
  date: ''
}

export function orderReducer(
  stateOrder: OrderState,
  actionOrder: OrderAction
): OrderState {
  switch (actionOrder.type) {
    case 'SET_LOADING':
      return { ...stateOrder, loading: actionOrder.payload }
    case 'SET_DATA':
      return { ...stateOrder, ...actionOrder.payload }
    case 'RESET':
      return initialOrderState
    default:
      return stateOrder
  }
}