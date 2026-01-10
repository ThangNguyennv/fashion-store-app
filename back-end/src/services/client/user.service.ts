import User from '~/models/user.model'
import Cart from '~/models/cart.model'
import * as sendMailHelper from '~/providers/mail.provider'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import Order from '~/models/order.model'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { JWTProvider } from '~/providers/jwt.provider'

export const register = async (data: any) => {
    const { fullName, email, password } = data
    
    const isExistEmail = await User.findOne({
      email: email
    })
    if (!isExistEmail) {
      return { 
        success: false, 
        code: 409, 
        message: 'Email đã tồn tại, vui lòng chọn email khác!' 
      }
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword
    })
    await user.save()

    return {
      success: true
    }
}

export const login = async (data: any, cartId: string) => {
    const { email, password } = data

    const user = await User.findOne({
      email: email,
      deleted: false
    }).select('+password')

    if (!user) {
      return { 
        success: false, 
        code: 401, 
        message: 'Tài khoản hoặc mật khẩu không chính xác!' 
      }
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return { 
        success: false, 
        code: 401,
        message: 'Tài khoản hoặc mật khẩu không chính xác!' 
      }
    }

    if (user.status === 'INACTIVE') {
      return { success: false, code: 403, message: 'Tài khoản đã bị khóa!' }
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
    let finalCartId: string
    const guestCartId = cartId
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
      finalCartId = userCart._id.toString()
    } else { // Case 2: User chưa có giỏ hàng (user mới)
      if (guestCartId) {
        // Case 2a: User chưa có giỏ, nhưng có giỏ khách
        // => Gán giỏ khách cho user
        await Cart.updateOne({ _id: guestCartId }, { user_id: user._id })
        finalCartId = guestCartId
      } else {
        // Case 2b: User mới, không có giỏ nào
        // => Tạo giỏ mới cho user
        const newCart = new Cart({ user_id: user._id, products: [] })
        await newCart.save()
        finalCartId = newCart._id.toString()
      }
    }

    const userInfo = user.toObject()
    delete userInfo.password

    return {
      success: true,
      accessTokenUser,
      refreshTokenUser,
      userInfo,
      cartId: finalCartId
    }
}

export const refreshToken = async (refreshTokenUser: string) => {
  if (!refreshTokenUser) {
    return { 
      success: false, 
      code: 401, 
      message: 'Không tồn tại refreshTokenUser!'
    }
  }
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
    return { 
      success: false, 
      code: 404, 
      message: 'User không tồn tại!' 
    }
  }
  const payload = { 
    userId: refreshTokenUserDecoded.userId
  }
  
  const newAccessTokenUser = await JWTProvider.generateToken(
    payload,
    process.env.JWT_ACCESS_TOKEN_SECRET_CLIENT,
    '1h'
  )
  return {
    success: true,
    newAccessTokenUser
  }
}

export const forgotPasswordPost = async (email: string) => {
  const user = await User.findOne({ 
    email: email, 
    deleted: false 
  })
  if (!user) {
    return {
      success: false,
      code: 404,
      message: 'Email không tồn tại!'
    }
  }
  const payload = { userId: user._id }
  const resetToken = await JWTProvider.generateToken(
    payload,
    process.env.JWT_SECRET_RESET_PASSWORD,
    '15m'
  )
  const clientUrl = process.env.CLIENT_URL
  const resetLink = `${clientUrl}/user/password/reset?resetToken=${resetToken}`

    const subject = 'Yêu cầu lấy lại mật khẩu'
    const html = `
    <p>Bạn đã yêu cầu lấy lại mật khẩu. Vui lòng nhấp vào đường link dưới đây:</p>
      <a href="${resetLink}" target="_blank">Lấy lại mật khẩu</a>
    <p>Đường link này sẽ hết hạn sau 15 phút.</p>
    `
  sendMailHelper.sendMail(email, subject, html)
  return {
    success: true
  }
}

export const resetPasswordPost = async (data: any) => {
  const { password, resetToken } = data

  if (!resetToken) {
    return {
      success: false,
      code: 401,
      message: 'resetToken không hợp lệ hoặc đã hết hạn!' 
    }
  }
  let resetTokenDecoded: any
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
    return {
      success: false,
      code: 404,
      message: 'Người dùng không tồn tại!'
    }
  }
  // Băm mật khẩu mới
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  await User.updateOne(
      { _id: user._id },
      { password: hashedPassword }
   )
}

export const editUser = async (account_id: string, data: any) => {
  const isEmailExist = await User.findOne({
    _id: { $ne: account_id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
    email: data.email,
    deleted: false
  })
  if (!isEmailExist) {
    return {
      success: false,
      code: 409,
      message: `Email ${data.email} đã tồn tại, vui lòng chọn email khác!`
    }
  }
  await User.updateOne({ _id: account_id }, data)
  return {
    success: true
  }
}

export const changePasswordUser = async (account_id: string, data: any) => {
  const user = await User.findOne({
    _id: account_id,
    deleted: false
  }).select('+password')
  if (!user) {
    return {
      success: false,
      code: 404,
      message: 'Không tìm thấy người dùng!'
    }
  }
  const isMatch = await bcrypt.compare(data.currentPassword, user.password)
  if (!isMatch) {
    return {
      success: false,
      code: 400,
      message: 'Mật khẩu hiện tại không chính xác, vui lòng nhập lại!'
    }
  }
  const salt = await bcrypt.genSalt(10)
  const newHashedPassword = await bcrypt.hash(data.password, salt)
  await User.updateOne(
    { _id: account_id }, 
    { password: newHashedPassword }
  )
  return {
    success: true
  }
}

export const getOrders = async (account_id: string, query: any) => {
  const find: any = { }
  const { status, date } = query
  const useId = account_id
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
  const objectSearch = searchHelpers(query)
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
    query,
    countOrders
  )
  // End Pagination

  // Sort
  let sort: Record<string, 1 | -1> = { }
  if (query.sortKey) {
    const key = query.sortKey.toString()
    const dir = query.sortValue === 'asc' ? 1 : -1
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
  if (query.sortKey === 'price' && query.sortValue) {
    const dir = query.sortValue === 'desc' ? -1 : 1
    orders.sort((a, b) => dir * (a['price'] - b['price']))
  }
  return {
    orders,
    objectSearch,
    objectPagination
  }
}

export const cancelOrder = async (id: string) => {
  const orderId = id
  await Order.updateOne(
    { _id: orderId },
    { status: 'CANCELED' }
  )
}

export const googleCallback = async (cartId: string, user: any) => {
  // 2. Logic giỏ hàng 
  const guestCartId = cartId
  
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
  return {
    accessTokenUser,
    refreshTokenUser,
    finalCartId
  }
}