import Cart from '~/models/cart.model'
import Product from '~/models/product.model'
import Order from '~/models/order.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import "~/crons/order.cron"

export const getCheckout = async (cartId: string) => {
  const cart = await Cart
    .findOne({ _id: cartId })
    .populate({
      path: 'products.product_id', // Đường dẫn đến trường cần làm đầy
      model: 'Product', // Tên model tham chiếu
      select: 'title thumbnail slug price discountPercentage colors sizes stock' // Chỉ lấy các trường cần thiết
    })
  
  // Nếu không có giỏ hàng, trả về an toàn
  if (!cart) {
    return { 
      success: false, 
      code: 404, 
      message: 'Giỏ hàng trống!', 
      cart: [] 
    }
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
  return {
    success: true,
    cart
  }
}

export const order = async (cartId: string, userId: string, data: any) => {
  const { note, paymentMethod, fullName, phone, address } = data
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
    return { 
      success: false, 
      code: 404, 
      message: 'Giỏ hàng trống!', 
      cart: [] 
    }
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
  return {
    success: true,
    newOrder,
    paymentMethod
  }
}

export const success = async (orderId: string) => {
  const order = await Order.findOne({
    _id: orderId
  })
  for (const product of order.products) {
    const productInfo = await Product
      .findOne({ _id: product.product_id })
      .select('title thumbnail')
    product['productInfo'] = productInfo
    product['priceNew'] = productsHelper.priceNewProduct(product as OneProduct)
    product['totalPrice'] = product['priceNew'] * product.quantity
  }
  order['totalsPrice'] = order.products.reduce(
    (sum, item) => sum + item['totalPrice'],
    0
  )
  return order
}