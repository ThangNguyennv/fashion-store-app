import Cart from '~/models/cart.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import mongoose from 'mongoose'

export const getCart = async (cartId: any) => {
  const cart = await Cart
    .findOne({ _id: cartId })
    .populate({
      path: 'products.product_id', // Đường dẫn đến trường cần làm đầy
      model: 'Product', // Tên model tham chiếu
      select: 'title thumbnail slug price discountPercentage colors sizes stock' // Chỉ lấy các trường cần thiết
    })
    .lean()
  
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
  return { success: true, cart }
}

export const addToCart = async (productId: string, data: any, cartId: any) => {
  const { quantity, color, size } = data 
  const result = await Cart.updateOne(
    {
      _id: cartId,
      products: {
        $elemMatch: { // Match 1 phần tử mảng với nhiều điều kiện
          product_id: productId,
          color: color,
          size: size
        }
      }
    },
    {
      // Dùng $inc để tăng số lượng một cách an toàn
      $inc: { 'products.$.quantity': quantity } 
    }
  )

  if (result.modifiedCount === 0) { // Dùng khi không có sản phẩm nào được cập nhật
    const productInfo = {
      product_id: productId,
      quantity: quantity,
      color: color,
      size: size
    }
    
    // Thêm sản phẩm mới vào giỏ hàng
  await Cart.updateOne(
      { _id: cartId },
      { $push: { products: productInfo } }
    )
  }
}

export const updateQuantity = async (cartId: any, data: any) => {
  const { productId, color, size, quantity } = data

  await Cart.updateOne(
    { 
      _id: cartId,
      'products.product_id': new mongoose.Types.ObjectId(productId),
      'products.color': color,
      'products.size': size
    },
    { $set: { 'products.$.quantity': quantity } }
  )
}

export const deleteInCart = async (cartId: any, data: any) => {
  const { productId, color, size } = data
  const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId)
  await Cart.updateOne(
    { _id: cartId },
    {
      $pull: { 
        products: { 
          product_id: productObjectId,
          color: color,
          size: size
        } 
      }
    }
  )
}

export const updateVariant = async (data: any, cartId: any) => {
  const { productId, oldColor, oldSize, newColor, newSize } = data

  // Tìm sản phẩm trong giỏ hàng với các thuộc tính cũ
  const result = await Cart.updateOne(
    {
      _id: cartId,
      'products.product_id': productId,
      'products.color': oldColor,
      'products.size': oldSize
    },
    {
      // Cập nhật lại color và size cho sản phẩm đó
      $set: {
        'products.$.color': newColor,
        'products.$.size': newSize
      }
    }
  )
  return result
}