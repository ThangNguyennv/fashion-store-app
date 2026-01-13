import type { CreatedBy, DeletedBy, FilterStatusInterface, PaginationInterface, UpdatedBy } from './helper.interface'

interface PaymentDetails {
  vnp_TxnRef?: string
  vnp_TransactionNo?: string
  vnp_BankCode?: string
  vnp_BankTranNo?: string
  vnp_CardType?: string
  vnp_OrderInfo?: string
  vnp_PayDate?: string
  vnp_ResponseCode?: string
}

export type OrderStatus = 'PENDING' | 'TRANSPORTING' | 'CONFIRMED' | 'CANCELED'

export interface OrderInfoInterface {
    deleted?: boolean,
    _id: string,
    cartId: string,
    userInfo: {
      fullName: string,
      phone: string,
      address: string
    },
    products: {
      product_id: string,
      title: string,
      price: number,
      discountPercentage: number,
      quantity: number,
      thumbnail: string,
      color: string,
      size: string
    }[]
    status: OrderStatus,
    createdBy: CreatedBy
    updatedBy: UpdatedBy[],
    deletedBy: DeletedBy,
    createdAt: Date | null
    updatedAt: Date | null,
    paymentInfo: {
      method: 'COD' | 'VNPAY' | 'MOMO' | 'ZALOPAY'
      status: 'PENDING' | 'PAID' | 'FAILED'
      details?: PaymentDetails
    },
    note?: string,
    amount: number,
    estimatedDeliveryDay: string,
    estimatedConfirmedDay: string
}
export interface OrderDetailInterface {
  order: OrderInfoInterface,
  code: number,
  message: string
}

export interface OrderAPIResponse {
  code: number,
  message: string,
  orders: OrderInfoInterface[],
  pagination: PaginationInterface,
  filterOrder: FilterStatusInterface[],
  allOrders?: OrderInfoInterface[],
  keyword: string
}

export interface OrderState {
  orders: OrderInfoInterface[],
  filterOrder: FilterStatusInterface[],
  pagination: PaginationInterface,
  allOrders?: OrderInfoInterface[],
  keyword: string
  sortKey: string
  sortValue: string
  loading: boolean,
  date: string,
}

export type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<OrderState> }
