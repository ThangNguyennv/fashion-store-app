import { Request, Response } from 'express'
import Cart from '~/models/cart.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import mongoose from 'mongoose'

// [GET] /cart
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
      message: 'Trả cart thành công!',
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

// [POST] /cart/add/:productId
export const addPost = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId
    const { quantity, color, size } = req.body 
    const cartId = req["cartId"]
    const result = await Cart.updateOne(
      {
        _id: cartId,
        products: {
          $elemMatch: {
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

    res.json({
      code: 201,
      message: 'Thêm thành công sản phẩm vào giỏ hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /cart/update-quantity
export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const cartId = req['cartId']
    const { productId, color, size, quantity } = req.body;

    await Cart.updateOne(
      { 
        _id: cartId,
        'products.product_id': new mongoose.Types.ObjectId(productId),
        'products.color': color,
        'products.size': size
      },
      { $set: { 'products.$.quantity': quantity } }
    );
    res.json({ code: 200, message: 'Cập nhật số lượng thành công!' });
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error });
  }
}

// [DELETE] /cart/delete-item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const cartId = req['cartId']
    const { productId, color, size } = req.body
    const productObjectId = new mongoose.Types.ObjectId(productId);
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
    res.json({ code: 204, message: 'Xóa thành công sản phẩm khỏi giỏ hàng!' });
  } catch (error) {
    console.error("LỖI KHI XÓA ITEM:", error);
    res.json({ code: 400, message: 'Lỗi!', error });
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
        res.json({
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
        res.json({
          code: 200,
          message: `Cập nhật thành công số lượng ${ids.length} sản phẩm!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại sản phẩm!'
        })
        break
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /cart/update-variant
export const updateVariant = async (req: Request, res: Response) => {
  try {
    const cartId = req["cartId"]
    const { productId, oldColor, oldSize, newColor, newSize } = req.body

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

    if (result.modifiedCount === 0) {
      return res.json({ code: 404, message: 'Không tìm thấy sản phẩm trong giỏ hàng.' })
    }

    res.json({ code: 200, message: 'Cập nhật phân loại thành công!' })

  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error })
  }
}