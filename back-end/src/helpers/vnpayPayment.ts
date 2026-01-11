import { Response } from 'express'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, HashAlgorithm } from 'vnpay'
import { Request } from 'express'
import Cart from '~/models/cart.model'
import Order from '~/models/order.model'
import { ReturnQueryFromVNPay } from 'vnpay'
import { StatusCodes } from 'http-status-codes'

export const vnpaybuildPaymentUrl = new VNPay({
  //  Cấu hình bắt buộc
  tmnCode: process.env.VNP_TMN_CODE,
  secureSecret: process.env.VNP_HASH_SECRET,
  vnpayHost: 'https://sandbox.vnpayment.vn',

  //  Cấu hình tùy chọn
  testMode: true, // Chế độ test
  hashAlgorithm: HashAlgorithm.SHA512, // Thuật toán mã hóa
  loggerFn: ignoreLogger // Custom logger
})

export const vnpayCreateOrder = (req: Request, totalBill: number, orderId: string,  res: Response) => {
  const expire = new Date()
  expire.setMinutes(expire.getMinutes() + 15) 
    //  Sinh mã giao dịch mới mỗi lần thanh toán
  const txnRef = `${orderId}-${Date.now()}`
  const vnpayResponse = vnpaybuildPaymentUrl.buildPaymentUrl({
    vnp_Amount: totalBill,
    vnp_IpAddr: req.ip || req.headers['x-forwarded-for']?.toString().split(',')[0] || '127.0.0.1',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Thanh toán đơn hàng: ${txnRef}`,
    vnp_OrderType: ProductCode.Other,
    // Thay API_ROOT = link ngrok
    vnp_ReturnUrl: `${process.env.API_ROOT}/checkout/vnpay-return`,
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(expire),
  })
  return res.status(StatusCodes.CREATED).json({ 
    code: 201,  
    message: 'Tạo link thanh toán thành công!', 
    paymentUrl: vnpayResponse
  })
}

// [GET] /checkout/vnpay-return
export const vnpayReturn = async (req: Request, res: Response) => {
  try {
    delete req.query['vnp_SecureHashType']  
    delete req.query['vnp_SecureHash'] 

    // Verify query từ VNPay
    const verified = vnpaybuildPaymentUrl.verifyReturnUrl(req.query as unknown as ReturnQueryFromVNPay)
    if (verified.isVerified) {
      // Lấy TxnRef (có dạng: orderId-timestamp)
      const txnRef = req.query["vnp_TxnRef"] as string

      // Tách phần orderId gốc trước dấu '-'
      const orderId = txnRef.split('-')[0]
      
      const order = await Order.findById(orderId)
      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({ 
          code: 404,  
          message: 'Không tìm thấy đơn hàng'
        })
      }
      if (req.query["vnp_ResponseCode"] === "00" && req.query["vnp_TransactionStatus"] === "00") {
        return res.redirect(`${process.env.CLIENT_URL}/checkout/success/${order.id}`)
      } 
      if (req.query["vnp_ResponseCode"] === "24" && req.query["vnp_TransactionStatus"] === "02") {
        return res.redirect(`${process.env.CLIENT_URL}/cart`)
      }
      return res.status(StatusCodes.OK).json({ 
        code: 200,  
        RspCode: '00',  
        Message: 'Thành công'
      })
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        code: 400,  
        RspCode: '97',
        Message: 'Sai chữ ký VNPay'
      })
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /checkout/vnpay-ipn
export const vnpayIpn = async (req: Request, res: Response) => {
  try {
    delete req.query['vnp_SecureHashType']  
    delete req.query['vnp_SecureHash'] 
    const verified = vnpaybuildPaymentUrl.verifyIpnCall(req.query as unknown as ReturnQueryFromVNPay)
    if (verified.isVerified) {
      const { vnp_TxnRef, vnp_TransactionNo, vnp_BankCode, vnp_BankTranNo, vnp_CardType, vnp_PayDate } = req.query
      const rspCode  = req.query["vnp_ResponseCode"]
      // Lấy TxnRef (có dạng: orderId-timestamp)
      const txnRef = vnp_TxnRef as string

      // Tách phần orderId gốc trước dấu '-'
      const orderId = txnRef.split('-')[0]
      const order = await Order.findById(orderId)

      if (!order) {
        return res.status(StatusCodes.NOT_FOUND).json({ 
          code: 404,
          RspCode: "01",  
          Message: 'Không tìm thấy đơn hàng!'
        })
      }
      // Nếu thanh toán thành công

      if (req.query["vnp_ResponseCode"] === "00" && req.query["vnp_TransactionStatus"] === "00") {
        await Cart.updateOne(
          { _id: order.cart_id },
          { products: [] }
        )
        order.paymentInfo.status = 'PAID'
        // Lưu thông tin giao dịch
        order.paymentInfo.details = {
          vnp_TxnRef: orderId,               // Mã đơn hàng của bạn (key liên kết để biết đơn nào đã thanh toán).
          vnp_TransactionNo: vnp_TransactionNo, // Mã giao dịch của VNPay (dùng để tra cứu với VNPay khi cần).
          vnp_BankCode: vnp_BankCode,           // Biết khách hàng dùng ngân hàng nào (tiện thống kê, hỗ trợ).
          vnp_BankTranNo: vnp_BankTranNo,       // Mã giao dịch ngân hàng
          vnp_CardType: vnp_CardType,
          vnp_PayDate: vnp_PayDate,             // Thời gian thanh toán (quan trọng cho báo cáo & tracking).
          vnp_ResponseCode: rspCode,               // Trạng thái giao dịch ("00" = thành công).
        }
      } 
      if (req.query["vnp_ResponseCode"] === "24" && req.query["vnp_TransactionStatus"] === "02") {
        order.paymentInfo.status = 'FAILED'
      }
      await order.save()
      return res.status(StatusCodes.OK).json({ 
        code: 200,
        RspCode: '00',  
        Message: 'Thành công'
      })
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        code: 400,
        RspCode: "97",  
        Message: 'Sai chữ ký VNPay'
      })
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}