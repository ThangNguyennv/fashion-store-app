/* eslint-disable indent */
import type { OrderAction, OrderState } from '~/types/order.type'

export const initialState: OrderState = {
  filterOrder: [],
  pagination: {
    currentPage: 1,
    limitItems: 3,
    skip: 0,
    totalPage: 0,
    totalItems: 0
  },
  keyword: '',
  sortKey: '',
  sortValue: '',
  loading: false,
  orders: [],
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
    default:
      return stateOrder
  }
}