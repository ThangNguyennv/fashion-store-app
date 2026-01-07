import { Request, Response } from 'express'
import Cart from '~/models/cart.model'
import Product from '~/models/product.model'
import Order from '~/models/order.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { vnpayCreateOrder } from '~/helpers/vnpayPayment'
import { zalopayCreateOrder } from '~/helpers/zalopayPayment'
import { momoCreateOrder } from '~/helpers/momoPayment'
import "~/crons/order.cron"

// [GET] /checkout
export const index = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
    const cart = await Cart
      .findOne({ _id: cartId })
      .populate({
        path: 'products.product_id', // Đường dẫn đến trường cần làm đầy
        model: 'Product', // Tên model tham chiếu
        select: 'title thumbnail slug price discountPercentage colors sizes stock' // Chỉ lấy các trường cần thiết
      })
    
    // Nếu không có giỏ hàng, trả về an toàn
    if (!cart) {
      return res.json({ code: 200, message: 'Giỏ hàng trống!', cartDetail: null })
    }
    // Tính toán tổng tiền sau khi đã có đầy đủ thông tin
    let totalsPrice = 0
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        // Sau khi populate, item.product_id sẽ là một object chứa thông tin sản phẩm
        const productInfo = item.product_id as any
        if (productInfo) {
          const priceNew = productsHelper.priceNewProduct(productInfo as OneProduct)
          item['productInfo'] = productInfo // Gán productInfo vào một trường ảo
          item['totalPrice'] = priceNew * item.quantity
          totalsPrice += item['totalPrice']
        }
      }
    }
    cart.totalsPrice = totalsPrice

    res.json({
      code: 200,
      message: 'Trả checkout thành công!',
      cartDetail: cart
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /checkout/order
export const order = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
    const userId = req["accountUser"].id
    const { note, paymentMethod, fullName, phone, address } = req.body
    const userInfo = {
      fullName: fullName,
      phone: phone, 
      address: address
    }
    const cart = await Cart.findById(cartId).populate({
      path: 'products.product_id',
      model: 'Product'
    })
    if (!cart || cart.products.length === 0) {
      return res.json({ code: 400, message: 'Giỏ hàng trống!' })
    }
    const products = cart.products.map(item => {
      const productInfo = item.product_id as any // Sau khi populate, đây là object
      return {
        product_id: productInfo._id,
        title: productInfo.title,
        thumbnail: productInfo.thumbnail,
        price: productInfo.price,
        discountPercentage: productInfo.discountPercentage,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      }
    })

    const totalBill = products.reduce((acc, product) => {
      const priceNew = (product.price * (100 - product.discountPercentage)) / 100
      return acc + priceNew * product.quantity
    }, 0)

    const orderInfo = {
      user_id: userId,
      cart_id: cartId,
      userInfo,
      products,
      amount: Math.floor(totalBill),
      note,
      paymentInfo: { method: paymentMethod, status: 'PENDING' }
    }
  
    const newOrder = new Order(orderInfo)
    await newOrder.save()
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
      code: 400,  
      message: 'Lỗi!', 
      error: error
    })
  } 
}


// [GET] /checkout/success/:orderId
export const success = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId
    })
    for (const product of order.products) {
      const productInfo = await Product
        .findOne({ _id: product.product_id })
        .select('title thumbnail')
      product['productInfo'] = productInfo
      product['priceNew'] = productsHelper.priceNewProduct(
        product as OneProduct
      )
      product['totalPrice'] = product['priceNew'] * product.quantity
    }
    order['totalsPrice'] = order.products.reduce(
      (sum, item) => sum + item['totalPrice'],
      0
    )
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
