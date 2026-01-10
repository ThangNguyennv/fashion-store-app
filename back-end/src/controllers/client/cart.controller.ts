import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Cart from '~/models/cart.model'
import * as cartService from '~/services/client/cart.service'

// [GET] /cart
export const index = async (req: Request, res: Response) => {
  try {
    const result = await cartService.getCart(req["cartId"])
    if (!result.success) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: result.code,
        message: result.message,
        cart: result.cart
      })
      return
    }
    const { cart } = result
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Trả cart thành công!',
      cartDetail: cart
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /cart/add/:productId
export const addToCart = async (req: Request, res: Response) => {
  try {
    await cartService.addToCart(req.params.productId, req.body, req["cartId"])

    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Thêm thành công sản phẩm vào giỏ hàng!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /cart/update-quantity
export const updateQuantity = async (req: Request, res: Response) => {
  try {
    await cartService.updateQuantity(req['cartId'], req.body)

    res.status(StatusCodes.OK).json({ 
      code: 200, 
      message: 'Cập nhật số lượng thành công!' 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /cart/delete-item
export const deleteInCart = async (req: Request, res: Response) => {
  try {
    await cartService.deleteInCart(req['cartId'], req.body)

    res.status(StatusCodes.NO_CONTENT).json({ 
      code: 204, 
      message: 'Xóa thành công sản phẩm khỏi giỏ hàng!' 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /cart/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const cartId = req.cookies.cartId
    const body = req.body as { type: string; ids: string[] }
    const type = body.type
    const ids = body.ids
    enum Key {
      DELETEALL = 'delete-all',
      CHANGEQUANTITY = 'change-quantity',
    }
    switch (type) {
      case Key.DELETEALL:
        let arrayId = []
        for (const item of ids) {
          const [id] = item.split('-')
          arrayId.push(id)
        }
        await Cart.updateOne(
          {
            _id: cartId,
          },
          {
            $pull: { products: { product_id: { $in: arrayId } } }
          }
        )
        res.status(StatusCodes.NO_CONTENT).json({
          code: 204,
          message: `Xóa thành công ${ids.length} sản phẩm!`
        })
        break
      case Key.CHANGEQUANTITY:
        for (const item of ids) {
          const [id, quantity] = item.split('-')
          await Cart.updateOne(
            { _id: cartId,
              'products.product_id': id
            },
            {
              $set: {
                'products.$.quantity': quantity
              }
            }
          )
        }
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công số lượng ${ids.length} sản phẩm!`
        })
        break
      default:
        res.status(StatusCodes.NOT_FOUND).json({
          code: 404,
          message: 'Không tồn tại sản phẩm!'
        })
        break
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /cart/update-variant
export const updateVariant = async (req: Request, res: Response) => {
  try {
    const result = await cartService.updateVariant(req.body, req["cartId"])

    if (result.modifiedCount === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ 
        code: 404, 
        message: 'Không tìm thấy sản phẩm trong giỏ hàng.' 
      })
      return
    }

    res.status(StatusCodes.OK).json({ 
      code: 200, 
      message: 'Cập nhật phân loại thành công!' 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}