import { Request, Response, NextFunction } from 'express'
import Cart from '~/models/cart.model'
import { getCookieOptions } from '~/utils/constants'

export const cartId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cartId = req.cookies.cartId

  if (!cartId) {
    // Tạo giỏ hàng
    const cart = new Cart()
    await cart.save()
    res.cookie('cartId', cart.id, getCookieOptions('30 days'))
    req["cartId"] = cart.id,
    req['miniCart'] = cart
  } else {
    // Lấy ra
    const cart = await Cart.findById(cartId)
    if (!cart) {
      // Nếu cookie có cartId nhưng CSDL không có (ví dụ: CSDL bị xóa)
      // => Tạo giỏ hàng mới
      const newCart = new Cart()
      await newCart.save()
      res.cookie('cartId', newCart.id, getCookieOptions('30 days'))
      req["cartId"] = newCart.id,
      req['miniCart'] = newCart
    } else {
      // Tìm thấy giỏ hàng
      if (cart.products.length > 0) {
        cart['totalProduct'] = cart.products.length
      }
      req["cartId"] = cart.id
      req['miniCart'] = cart
    }
  }
  next()
}
