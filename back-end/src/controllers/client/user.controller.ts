import { Request, Response } from 'express'
import User from '~/models/user.model'
import Cart from '~/models/cart.model'
import * as sendMailHelper from '~/helpers/sendMail'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import Order from '~/models/order.model'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { JWTProvider } from '~/providers/jwt.provider'
import { StatusCodes } from 'http-status-codes'
import { getCookieOptions } from '~/utils/constants'

// [POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body

    const isExistEmail = await User.findOne({
      email: email
    })
    if (isExistEmail) {
      res.json({
        code: 401,
        message: 'Email đã tồn tại, vui lòng chọn email khác!'
      })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword
    })
    await user.save()
    res.json({
      code: 201,
      message: 'Đăng ký tài khoản thành công, mời bạn đăng nhập lại để tiếp tục!'
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!' })
  }
}

// [POST] /user/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({
      email: email,
      deleted: false
    }).select('+password')
    
    if (!user) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.json({
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })
      return
    }
    if (user.status === 'INACTIVE') {
      res.json({
        code: 403,
        message: 'Tài khoản đang bị khóa!'
      })
      return
    }

    const payload = { 
      userId: user._id,
      email: user.email 
    }
    const accessTokenUser = await JWTProvider.generateToken(
      payload, 
      process.env.JWT_ACCESS_TOKEN_SECRET_CLIENT,
      '1h' 
    )
    const refreshTokenUser = await JWTProvider.generateToken(
      payload, 
      process.env.JWT_REFRESH_TOKEN_SECRET_CLIENT,
      '14d' 
    )

    const guestCartId = req.cookies.cartId
    const userCart = await Cart.findOne({ user_id: user._id })

    // Case 1: User đã có giỏ hàng cũ (userCart)
    if (userCart) {
      if (guestCartId && guestCartId !== userCart._id.toString()) {
        // Case 1a: User có giỏ cũ VÀ có giỏ khách (guestCartId)
        // => Gộp sản phẩm từ giỏ khách vào giỏ cũ
        const guestCart = await Cart.findById(guestCartId)
        if (guestCart && guestCart.products.length > 0) {
          userCart.products.push(...guestCart.products)
          await userCart.save()
          await Cart.deleteOne({ _id: guestCartId })
        }
      }
      // Case 1b: User có giỏ cũ, không có giỏ khách
      // => Chỉ cần set cookie về giỏ cũ
      res.cookie('cartId', userCart._id.toString(), getCookieOptions('30 days'))
    } else { // Case 2: User chưa có giỏ hàng (user mới)
      if (guestCartId) {
        // Case 2a: User chưa có giỏ, nhưng có giỏ khách
        // => Gán giỏ khách cho user
        await Cart.updateOne({ _id: guestCartId }, { user_id: user._id })
        res.cookie('cartId', guestCartId, getCookieOptions('30 days'))
      } else {
        // Case 2b: User mới, không có giỏ nào
        // => Tạo giỏ mới cho user
        const newCart = new Cart({ user_id: user._id, products: [] })
        await newCart.save()
        res.cookie('cartId', newCart._id.toString(), getCookieOptions('30 days'))
      }
    }

    const userInfo = user.toObject()
    delete userInfo.password

    res.cookie('accessTokenUser', accessTokenUser, getCookieOptions('14 days'))
    res.cookie('refreshTokenUser', refreshTokenUser, getCookieOptions('14 days'))

    res.json({
      code: 200,
      message: 'Đăng nhập thành công!',
      accountUser: userInfo
    })
  } catch (error) {
    res.json({ 
      code: 400, 
      message: 'Lỗi!'
    })
  }
}

// [POST] /user/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  const refreshTokenUser = req.cookies?.refreshTokenUser

  if (!refreshTokenUser) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Không tồn tại refreshTokenUser!' })
    return
  }
  try {
    const refreshTokenUserDecoded = await JWTProvider.verifyToken(
      refreshTokenUser, 
      process.env.JWT_REFRESH_TOKEN_SECRET_CLIENT
    ) as {
      userId: string
    }
    const user = await User.findOne({
      _id: refreshTokenUserDecoded.userId,
      deleted: false,
      status: "ACTIVE"
    })
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User không tồn tại!' })
      return
    }
    // const session = await Session.findOne({
    //   accountId: new mongoose.Types.ObjectId(refreshTokenDecoded.accountId),
    //   refreshTokenHash: hashToken(refreshToken)
    // })

    // if (!session) {
    //   res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh Token không hợp lệ' })
    //   return
    // }
    
    // // Xóa phiên cũ, tạo phiên mới + accessToken mới
    // await session.deleteOne()

    const payload = { 
      userId: refreshTokenUserDecoded.userId
    }

    const newAccessTokenUser = await JWTProvider.generateToken(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET_CLIENT,
      '1h'
    )

    // const newRefreshToken = await JWTProvider.generateToken(
    //   payload,
    //   process.env.JWT_REFRESH_TOKEN_SECRET_ADMIN,
    //   '14 days'
    // )
    // console.log("🚀 ~ auth.controller.ts ~ refreshToken ~ newRefreshToken:", newRefreshToken);

    res.cookie('accessTokenUser', newAccessTokenUser, getCookieOptions('14 days'))

    res.status(StatusCodes.OK).json({ message: 'Làm mới accessTokenUser thành công!' })
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json( {message: 'RefreshToken invalid!'} )
  }
}

// [GET] /user/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('accessTokenUser', getCookieOptions('14 days'))
    res.clearCookie('refreshTokenUser', getCookieOptions('14 days'))

    res.json({
      code: 200,
      message: 'Đăng xuất thành công!'
    })
  } catch (error) {
    res.json({ 
      code: 400, 
      message: 'Lỗi!'
    })
  }
}

// [POST] /user/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email: email, deleted: false })
    if (!user) {
      res.json({ code: 401, message: 'Email không tồn tại!' })
      return
    }

    const payload = { userId: user._id }
    const resetToken = await JWTProvider.generateToken(
      payload,
      process.env.JWT_SECRET_RESET_PASSWORD,
      '15m'
    )

    // // Lưu thông tin vào db
    // const otp = generateHelper.generateRandomNumber(6)
    // const objectForgotPassword = {
    //   email: email,
    //   otp: otp,
    //   expireAt: Date.now()
    // }
    // const record = await ForgotPassword.findOne({
    //   email: email
    // })
    // const forgotPassword = new ForgotPassword(objectForgotPassword)
    // // Tránh trường hợp gửi otp liên tục mà phải hết hạn otp đó thì mới gửi otp khác.
    // if (!record) {
    //   res.json({
    //     code: 200,
    //     message:
    //       'Mã OTP đã được gửi qua email của bạn, vui lòng kiểm tra email!'
    //   })
    //   await forgotPassword.save()
    // }
    // // Nếu tồn tại email thì gửi mã OTP qua email
    // const subject = 'Mã OTP xác minh lấy lại mật khẩu'
    // const html = `
    //   Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 2 phút.
    // `

    const clientUrl = process.env.CLIENT_URL
    const resetLink = `${clientUrl}/user/password/reset?resetToken=${resetToken}`

    const subject = 'Yêu cầu lấy lại mật khẩu'
    const html = `
      <p>Bạn đã yêu cầu lấy lại mật khẩu. Vui lòng nhấp vào đường link dưới đây:</p>
      <a href="${resetLink}" target="_blank">Lấy lại mật khẩu</a>
      <p>Đường link này sẽ hết hạn sau 15 phút.</p>
    `
    sendMailHelper.sendMail(email, subject, html)
    res.json({
      code: 200,
      message: 'Chúng tôi đã gửi một link lấy lại mật khẩu qua email của bạn. Vui lòng kiểm tra hộp thư.'
    })
  } catch (error) {
   res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// // [POST] /user/password/otp
// export const otpPasswordPost = async (req: Request, res: Response) => {
//   try {
//     const email = req.body.email
//     const otp = req.body.otp
//     const result = await ForgotPassword.findOne({
//       email: email,
//       otp: otp
//     })
//     if (!result) {
//       res.json({
//         code: 401,
//         message: 'OTP không hợp lệ!'
//       })
//       return
//     }
//     const user = await User.findOne({
//       email: email
//     })
//     res.cookie('tokenUser', user.tokenUser)
//     res.json({
//       code: 200,
//       message: 'Mã OTP hợp lệ!'
//     })
//   } catch (error) {
//     res.json({
//       code: 400,
//       message: 'Lỗi!',
//       error: error
//     })
//   }
// }

// [POST] /user/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  try {
    const { password, resetToken } = req.body

    if (!resetToken) {
      res.json({ code: 401, message: 'resetToken không hợp lệ hoặc đã hết hạn.' })
      return
    }

    // Xác thực reset token
    // let payload: any
    // try {
    //   payload = jwt.verify(resetToken, process.env.JWT_SECRET_RESET_PASSWORD)
    // } catch (verifyError) {
    //   return res.json({ code: 401, message: 'Token không hợp lệ hoặc đã hết hạn.' })
    // }
    let resetTokenDecoded: any
    try {
      resetTokenDecoded = await JWTProvider.verifyToken(
        resetToken,
        process.env.JWT_SECRET_RESET_PASSWORD
      ) as {
        userId: string
      }
      const user = await User.findOne({
        _id: resetTokenDecoded.userId,
        deleted: false,
        status: "ACTIVE"
      })
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User không tồn tại!' })
        return
      }
      // Băm mật khẩu mới
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      await User.updateOne(
        { _id: user._id },
        { password: hashedPassword }
      )
      res.json({
        code: 200,
        message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập.'
      })
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return res.json({ code: 401, message: 'Link đã hết hạn (quá 15 phút). Vui lòng yêu cầu lại!' })
      }
      return res.json({ code: 401, message: 'Token không hợp lệ!' })
    }
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// [GET] /user/info
export const info = async (req: Request, res: Response) => {
  try {
    const accountUser = req['accountUser'] 
    res.json({
      code: 200,
      message: 'Thông tin tài khoản!',
      accountUser: accountUser
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// [PATCH] /user/info/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const isEmailExist = await User.findOne({
      _id: { $ne: req['accountUser'].id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: req.body.email,
      deleted: false
    })
    if (isEmailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại, vui lòng chọn email khác!`
      })
    } 

    // Xóa các trường nhạy cảm không được phép cập nhật
    delete req.body.password
    delete req.body.tokenUser
    await User.updateOne({ _id: req['accountUser'].id }, req.body)
    res.json({
      code: 200,
      message: 'Đã cập nhật thành công tài khoản!'
    })
    
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// [PATCH] /user/info/edit/change-password
export const changePasswordPatch = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      _id: req['accountUser'].id,
      deleted: false
    }).select('+password')

    if (!user) {
      return res.json({ code: 404, message: 'Không tìm thấy người dùng.' })
    }

    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password)
    if (!isMatch) {
      return res.json({ code: 400, message: 'Mật khẩu hiện tại không chính xác, vui lòng nhập lại!' })
    }

    const salt = await bcrypt.genSalt(10)
    const newHashedPassword = await bcrypt.hash(req.body.password, salt)

    await User.updateOne(
      { _id: req['accountUser'].id }, 
      { password: newHashedPassword }
    )

    res.json({
      code: 200,
      message: 'Đã đổi mật khẩu tài khoản thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /user/my-orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const find: any = { }
    const { status, date } = req.query
    const useId = req["accountUser"].id
    // Filter
    find.user_id = useId
    find.deleted = false
    if (status) {
      find.status = status
    }
    if (date) {
      const startDate = new Date(date.toString()) // Bắt đầu từ 00:00:00 của ngày được chọn
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date.toString()) // Kết thúc vào 23:59:59 của ngày được chọn
      endDate.setHours(23, 59, 59, 999)

      // Tìm các đơn hàng có `createdAt` nằm trong khoảng thời gian của ngày đó
      find.createdAt = {
        $gte: startDate, // Lớn hơn hoặc bằng thời điểm bắt đầu ngày
        $lte: endDate    // Nhỏ hơn hoặc bằng thời điểm kết thúc ngày
      }
    }
    // End filter

    // Search
    const objectSearch = searchHelpers(req.query)
    if (objectSearch.keyword) {
      find._id = new mongoose.Types.ObjectId(objectSearch.keyword)
    }
    // End search

    // Pagination
    const countOrders = await Order.countDocuments(find)
    const objectPagination = paginationHelpers(
      {
        currentPage: 1,
        limitItems: 5
      },
      req.query,
      countOrders
    )
    // End Pagination

    // Sort
    let sort: Record<string, 1 | -1> = { }
    if (req.query.sortKey) {
      const key = req.query.sortKey.toString()
      const dir = req.query.sortValue === 'asc' ? 1 : -1
      sort[key] = dir
    }
    // luôn sort phụ theo createdAt
    if (!sort.createdAt) {
      sort.createdAt = -1
    }
    // End Sort

    const orders = await Order
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .lean()

    // Sort chay do không sài hàm sort() kia cho các thuộc tính không có trong db.
    if (req.query.sortKey === 'price' && req.query.sortValue) {
      const dir = req.query.sortValue === 'desc' ? -1 : 1
      orders.sort((a, b) => dir * (a['price'] - b['price']))
    }
  
    res.json({
      code: 200,
      message: 'Thành công!',
      orders: orders,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /user/my-orders/cancel-order/:id
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id
    await Order.updateOne(
      { _id: orderId },
      { status: 'CANCELED' }
    )
    res.json({
      code: 200,
      message: 'Hủy thành công đơn hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /user/auth/google/callback
export const googleCallback = async (req: Request, res: Response) => {
  try {
    // 1. Nhận user từ Passport (đã được xác thực bởi passport.ts)
    const user = req.user as any

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/user/login?error=auth_failed`)
    }
    // Nếu không có user hoặc user bị khóa
    if (user.status === 'INACTIVE') {
      return res.redirect(`${process.env.CLIENT_URL}/user/login?error=account_locked`)
    }

    // 2. Logic giỏ hàng 
    const guestCartId = req.cookies.cartId
    
    const userCart = await Cart.findOne({ user_id: user._id })  
    let finalCartId: string

    // TH1: User đã có giỏ hàng cũ(userCart)
    if (userCart) {
      finalCartId = userCart._id.toString()

      if (guestCartId && guestCartId !== finalCartId) {
        // TH1a: User có giỏ cũ VÀ có giỏ khách(guestCartId)
        // => Gộp sản phẩm từ giỏ khách vào giỏ cũ
        const guestCart = await Cart.findById(guestCartId)
        if (guestCart && guestCart.products.length > 0) {
          // Chuyển đổi products sang Object thuần túy để tránh lỗi Mongoose
          const userProducts = userCart.toObject().products || []
          const guestProducts = guestCart.toObject().products || []

          const productMap = new Map()
          // Hàm tạo Key duy nhất (ProductId + Color + Size)
          const generateKey = (pId: string, color: string, size: string) => {
            return `${pId}-${color || 'null'}-${size || 'null'}`
          }
          // Thêm sản phẩm từ giỏ user cũ
          userProducts.forEach((item: any) => {
            const productId = item.product_id._id ? item.product_id._id.toString() : item.product_id.toString()
            const key = generateKey(productId, item.color, item.size)
            productMap.set(key, {
              product_id: productId,
              quantity: item.quantity,
              color: item.color,
              size: item.size
            })
          })

          // Merge với sản phẩm từ giỏ khách
          guestProducts.forEach((item: any) => {
           const productId = item.product_id._id ? item.product_id._id.toString() : item.product_id.toString()
           const key = generateKey(productId, item.color, item.size)
            if (productMap.has(key)) {
              // check xem có cùng color và size không
              const existingItem = productMap.get(key)
              // Cùng sản phẩm, cùng color và size => Cộng dồn số lượng
              existingItem.quantity += item.quantity
            } else {
              productMap.set(key, {
                product_id: (item.product_id._id || item.product_id).toString(),
                quantity: item.quantity,
                color: item.color,
                size: item.size
              })
            }
          })

          userCart.set('products', Array.from(productMap.values()))
          await userCart.save()
          await Cart.deleteOne({ _id: guestCartId })      
        }
      }
      
      // TH1b: User có giỏ cũ, không có giỏ khách
      // => Chỉ cần set cookie về giỏ cũ
      //res.cookie('cartId', finalCartId, COOKIE_OPTIONS)
    } else {
      // TH2: User chưa có giỏ hàng (user mới)
      if (guestCartId) {
        // TH2a: User chưa có giỏ, nhưng có giỏ khách
        // => Gán giỏ khách cho user
        finalCartId = guestCartId
        await Cart.updateOne({ _id: guestCartId }, { user_id: user._id })
      } else {
        // TH2b: User mới, không có giỏ nào
        // => Tạo giỏ mới cho user
        const newCart = new Cart({ user_id: user._id, products: [] })
        await newCart.save()
        finalCartId = newCart._id.toString()
      }
      //res.cookie('cartId', finalCartId, COOKIE_OPTIONS)
    }

    // 3. Tạo JWT (token đăng nhập chính)
    const payload = { userId: user._id, email: user.email }
    const accessTokenUser = await JWTProvider.generateToken(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET_CLIENT,
      '1h'
    )
    const refreshTokenUser = await JWTProvider.generateToken(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET_CLIENT,
      '14d'
    )

    // 4. Gửi JWT về client qua cookie
    const redirectUrl = new URL(`${process.env.CLIENT_URL}/auth/google/callback`)
    redirectUrl.searchParams.set('accessTokenUser', accessTokenUser)
    redirectUrl.searchParams.set('refreshTokenUser', refreshTokenUser)
    redirectUrl.searchParams.set('cartId', finalCartId)

    // 5. Chuyển hướng người dùng về trang chủ React
    res.redirect(redirectUrl.toString())

  } catch (error) {
    console.error("LỖI GOOGLE CALLBACK:", error)
    res.redirect(`${process.env.CLIENT_URL}/user/login?error=server_error`)
  }
}

// [POST] /user/set-auth-cookies
export const setAuthCookies = async (req: Request, res: Response) => {
  try {
    const { accessTokenUser, refreshTokenUser, cartId } = req.body

    res.cookie('accessTokenUser', accessTokenUser, getCookieOptions('14 days'))
    res.cookie('refreshTokenUser', refreshTokenUser, getCookieOptions('14 days'))

    if (cartId) {
      res.cookie('cartId', cartId, getCookieOptions('30 days'))
    }

    res.json({ 
      success: true, 
      message: "Đã set cookies thành công" 
    })
  } catch (error) {
    console.error('Lỗi setAuthCookies:', error)
    res.status(401).json({ 
      success: false, 
      message: "Token không hợp lệ" 
    })
  }
}