import type { ProductInfoInterface } from './product.interface'

// Định nghĩa cho MỘT sản phẩm trong giỏ hàng
export interface CartItemInterface {
  quantity: number
  color: string
  size: string
  product_id: ProductInfoInterface
  totalPrice?: number
}

export interface CartInfoInterface {
  _id: string
  products: CartItemInterface[]
  totalsPrice?: number
}

export interface CartDetailInterface {
  cartDetail: CartInfoInterface
}