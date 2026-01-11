import { Response } from 'express'
import moment from 'moment'
import axios from 'axios'
import crypto from 'crypto'
import { Request } from 'express'
import Cart from '~/models/cart.model'
import Order from '~/models/order.model'
import { StatusCodes } from 'http-status-codes'

export const zalopayCreateOrder = async (
  totalBill: number, 
  products: {product_id: string, title: string, price: number, discountPercentage: number, quantity: number}[], 
  phoneUser: string, 
  orderId: string, 
  res: Response
) => {
  const embed_data = {
    redirecturl: `${process.env.CLIENT_URL}/checkout/success/${orderId}`
  }
  const items = products.map(p => ({
    itemid: p.product_id,
    itemname: p.title,
    itemprice: Math.floor(p.price * (100 - p.discountPercentage) / 100),
    itemquantity: p.quantity
  }))

  const transID = Math.floor(Math.random() * 1000000)
  const orderInfo = {
    app_id: process.env.ZALOPAY_APP_ID, // Định danh cho ứng dụng đã được cấp bởi ZaloPay.
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // mã giao dich có định dạng yyMMdd_xxxx
    app_user: `${phoneUser}-${orderId}`, // Số điện thoại người dùng - Mã đơn hàng
    app_time: Date.now(), // Thời gian tạo đơn hàng (unix timestamp in milisecond). Thời gian tính đến milisecond, lấy theo current time và không quá 15 phút so với thời điểm thanh toán
    item: JSON.stringify(items), // 	Dữ liệu riêng của đơn hàng. Dữ liệu này sẽ được callback lại cho AppServer khi thanh toán thành công (Nếu không có thì để chuỗi rỗng). Dạng [{...}]
    embed_data: JSON.stringify(embed_data), 
    amount: Math.floor(totalBill), 
    description: `Thanh toán đơn hàng ${transID}`,
    bank_code: "", 
    mac: '',
    // Thay CLIENT_URL = link ngrok
    callback_url: `${process.env.CLIENT_URL}/checkout/zalopay-callback`
  }

  console.log('hello zalopayCreateOrder')
  const data = [
    orderInfo.app_id,
    orderInfo.app_trans_id,
    orderInfo.app_user,
    orderInfo.amount,
    orderInfo.app_time,
    orderInfo.embed_data,
    orderInfo.item
  ].join('|')
  orderInfo.mac = crypto.createHmac('sha256', process.env.ZALOPAY_KEY1)
    .update(data)
    .digest('hex')

  const zaloRes  = await axios.post(process.env.ZALOPAY_ENDPOINT_CREATE, null, { params: orderInfo })
  console.log("🚀 ~ zalopayPayment.ts ~ zalopayCreateOrder ~ zaloRes:", zaloRes);
  if (zaloRes.data.return_code !== 1) {
    // Thất bại
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      code: 400,  
      message: 'Giao dịch thất bại, tài khoản chưa bị trừ tiền, vui lòng thực hiện lại.', 
      error: zaloRes.data
    })
  }
  if (zaloRes.data.return_code === 1 && zaloRes.data.sub_return_code === 1) {
    // Thành công
    return res.status(StatusCodes.CREATED).json({ 
      code: 201,  
      message: 'Thành công!', 
      order_url: zaloRes.data.order_url, 
      zalo_token: zaloRes.data.zp_trans_token
    })
  } 
}

// [POST] /checkout/zalopay-callback
export const zalopayCallback = async (req: Request, res: Response) => {
  try {
    let { data, mac } = req.body
      console.log('hello zalopayCallback')
    const macVerify = crypto.createHmac("sha256", process.env.ZALOPAY_KEY2)
      .update(data)
      .digest("hex")
    
    if (macVerify !== mac) {
      return res.json({ 
        return_code: -1, 
        return_message: "mac not match" 
      }) // Báo lỗi, thường khi MAC không khớp (nghi ngờ giả mạo).
    }
    let dataJson = JSON.parse(data)
    const [phone, id] = dataJson.app_user.split("-");
    const order = await Order.findOne({
      _id: id,
      'userInfo.phone': phone,
      deleted: false,
    })
    console.log("🚀 ~ zalopayPayment.ts ~ zalopayCallback ~ order:", order);
    if (!order) {
      return res.json({ 
        return_code: 0, 
        return_message: 'order not found' 
      })
    }
    // Thanh toán thành công
    await Cart.updateOne({ _id: order.cart_id }, { products: [] })
    order.paymentInfo.status = "PAID"
    order.paymentInfo.details = {
      app_trans_id: dataJson.app_trans_id,
      app_time: dataJson.app_time,
      amount: dataJson.amount,
    }
    await order.save()
    return res.json({ 
      return_code: 1, 
      return_message: "success" 
    }) // Báo cho ZaloPay biết bạn đã nhận callback thành công.
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      return_code: 0, 
      return_message: 'retry'
    }) // Báo cho ZaloPay retry lại callback (ví dụ server bạn đang lỗi DB).
  }
}

// export const zaloPayQueryOrder  = async (app_trans_id: string) => {
//   console.log("vao query order zalopay")
//   const key1 = process.env.ZALOPAY_KEY1
//   const app_id = process.env.ZALOPAY_APP_ID
  
//   const data = `${app_id}|${app_trans_id}|${key1}`
//   const mac = crypto.createHmac("sha256", key1)
//     .update(data)
//     .digest("hex")
//   const payload = {
//     app_id,
//     app_trans_id,
//     mac
//   }
//   const response = await axios.post(
//     process.env.ZALOPAY_ENDPOINT_QUERY,
//     qs.stringify(payload), // convert sang form-urlencoded
//     { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//   )
//   console.log("🚀 ~ zalopayPayment.ts ~ zaloPayQueryOrder ~ response:", response);
//   if (response.data.return_code !== 1) {
//     // API gọi thất bại -> sai request
//     return { status: "ERROR", data: response }
//   }
//   switch (response.data.sub_return_code) {
//     case 1:
//       return { status: "PAID", data: response }
//     case 2:
//       return { status: "FAILED", data: response }
//     default:
//       return { status: "PENDING", data: response }
//   }
// }