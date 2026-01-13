import type { OrderInfoInterface } from '~/interfaces/order.interface'

export const getTotalBill = (order: OrderInfoInterface): number => {
  const result = order.products.reduce((acc, item) => {
    const priceNewForOneProduct =
    item.price * (100 - item.discountPercentage) / 100

    return acc + priceNewForOneProduct * item.quantity
  }, 0)
  return result
}