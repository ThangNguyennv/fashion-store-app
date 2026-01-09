import { Request, Response } from 'express'
import Cart from '~/models/cart.model'
import Product from '~/models/product.model'
import { vnpayCreateOrder } from '~/helpers/vnpayPayment'
import { zalopayCreateOrder } from '~/helpers/zalopayPayment'
import { momoCreateOrder } from '~/helpers/momoPayment'
import "~/crons/order.cron"
import * as checkoutService from '~/services/client/checkout.service'

// [GET] /checkout
export const index = async (req: Request, res: Response) => {
  try {
    const cart = await checkoutService.getCheckout(req["cartId"])

    res.json({
      code: 200,
      message: 'Trả checkout thành công!',
      cartDetail: cart
    })
  } catch (error) {
    res.json({
      code: error.statusCode || 400,
      message: error.message || 'Lỗi',
      error: error
    })
  }
}

// [POST] /checkout/order
export const order = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
    const userId = req["accountUser"].id
    const { newOrder, paymentMethod } = await checkoutService.order(cartId, userId, req.body)

    if (paymentMethod === 'COD') {
      await Cart.updateOne({ _id: cartId }, { products: [] })
      return res.json({ 
        code: 201,  
        message: 'Đặt hàng thành công!', 
        order: newOrder
      })
    } else if (paymentMethod === 'VNPAY') {
      vnpayCreateOrder(newOrder.amount, newOrder.id, res)
    } else if (paymentMethod === 'ZALOPAY') {
      const zaloProducts = newOrder.products.map(p => ({
        product_id: p.product_id.toString(),
        title: p.title,
        price: p.price,
        discountPercentage: p.discountPercentage,
        quantity: p.quantity
      }))
      zalopayCreateOrder(newOrder.amount, zaloProducts, newOrder.userInfo.phone, newOrder.id, res)
    } else if (paymentMethod === 'MOMO') {
      momoCreateOrder(newOrder.id, newOrder.amount, res)
    }
    // Trừ kho hàng
    for (const item of newOrder.products) {
      await Product.updateOne(
        { _id: item.product_id },
        [
          { $set: { stock: { $max: [0, { $subtract: ["$stock", item.quantity] }] } } }
        ]
      )
    }
  } catch (error) {
    res.json({ 
      code: error.statusCode || 400,
      message: error.message || 'Lỗi',
      error: error
    })
  } 
}


// [GET] /checkout/success/:orderId
export const success = async (req: Request, res: Response) => {
  try {
    const order = await checkoutService.success(req.params.orderId)

    res.json({ 
      code: 200,  
      message: 'Đặt hàng thành công',
      order: order
    })
  } catch (error) {
    res.json({ 
      code: 400,  
      message: 'Lỗi!',
      error: error
    })
  }
}
