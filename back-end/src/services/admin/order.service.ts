import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import Order from '~/models/order.model'
import ExcelJS from 'exceljs'

export const getOrders = async (query: any) => {
  const find: any = { deleted: false }

  if (query.status) {
    find.status = query.status.toString()
  }
  
  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex) {
    find["userInfo.phone"] = objectSearch.regex
  }
  // End search

  // Pagination
  const countOrders = await Order.countDocuments(find)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 15
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

  const [orders, allOrders] = await Promise.all([
    Order
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .lean()  
      .populate('createdBy.account_id', 'fullName email') // Lấy thông tin người tạo
      .populate('updatedBy.account_id', 'fullName email')
      .lean(),
    Order
      .find({deleted: false})
      .lean()
  ])
  return {
    orders,
    allOrders,
    objectSearch,
    objectPagination
  }
}

export const changeStatusOrder = async (status: string, id: string, account_id: string) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  const updater = await Order
    .findByIdAndUpdate(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy }
      },
      { new: true } // Trả về document sau update
    )
    .populate('updatedBy.account_id', 'fullName email')
    .lean() 
  return updater
}

export const deleteOrder = async (id: string, account_id: string) => {
  return Order.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: account_id,
        deletedAt: new Date()
      }
    }
  )
}

export const detailOrder = async (id: string) => {
  const find = {
    deleted: false,
    _id: id
  }
  const order = await Order.findOne(find)
  return order
}

export const estimatedDeliveryDay = async (data: any, account_id: string) => {
  const estimatedDeliveryDay = data.estimatedDeliveryDay
  const orderId = data.id
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  return Order.updateOne(
    { _id: orderId },
    { estimatedDeliveryDay: estimatedDeliveryDay, $push: { updatedBy: updatedBy }}
  )
}

export const estimatedConfirmedDay = async (data: any, account_id: string) => {
  const estimatedConfirmedDay = data.estimatedConfirmedDay
  const orderId = data.id
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  return Order.updateOne(
    { _id: orderId },
    { estimatedConfirmedDay: estimatedConfirmedDay, $push: { updatedBy: updatedBy }}
  )
}

export const exportOrder = async (query: any) => {
  const find: any = { deleted: false }
  const status = query.status as string

  if (status) {
      find.status = status
    }

  // Lấy TẤT CẢ đơn hàng (không phân trang) khớp với bộ lọc
    const orders = await Order.find(find).sort({ createdAt: -1 })

  // Tạo file Excel
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Đơn hàng ${status || 'Tất cả'}`)

  // Định nghĩa các cột
  worksheet.columns = [
    { header: 'Mã Đơn Hàng', key: 'orderId', width: 30 },
    { header: 'Ngày Đặt', key: 'createdAt', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm:ss' } },
    { header: 'Tên Khách Hàng', key: 'customerName', width: 30 },
    { header: 'Số Điện Thoại', key: 'phone', width: 20 },
    { header: 'Địa Chỉ', key: 'address', width: 50 },
    { header: 'Trạng Thái Đơn', key: 'orderStatus', width: 20 },
    { header: 'Sản Phẩm', key: 'productTitle', width: 40 },
    { header: 'Phân Loại (Màu)', key: 'color', width: 15 },
    { header: 'Phân Loại (Size)', key: 'size', width: 15 },
    { header: 'Số Lượng', key: 'quantity', width: 10 },
    { header: 'Đơn Giá (Đã giảm)', key: 'price', width: 20, style: { numFmt: '#,##0"đ"' } },
    { header: 'Thành Tiền', key: 'total', width: 20, style: { numFmt: '#,##0"đ"' } },
    { header: 'PT Thanh Toán', key: 'paymentMethod', width: 15 },
    { header: 'TT Thanh Toán', key: 'paymentStatus', width: 15 },
    { header: 'Ghi Chú', key: 'note', width: 30 }
  ]

  // Làm cho hàng tiêu đề in đậm
  worksheet.getRow(1).font = { bold: true }

  // Thêm dữ liệu vào file
  for (const order of orders) {
    for (const product of order.products) {
      const priceNew = Math.floor(product.price * (100 - product.discountPercentage) / 100)
      
      worksheet.addRow({
        orderId: order._id.toString(),
        createdAt: order.createdAt,
        customerName: order.userInfo.fullName,
        phone: order.userInfo.phone,
        address: order.userInfo.address,
        orderStatus: order.status,
        productTitle: product.title,
        color: product.color, 
        size: product.size,  
        quantity: product.quantity,
        price: priceNew,
        total: priceNew * product.quantity,
        paymentMethod: order.paymentInfo.method,
        paymentStatus: order.paymentInfo.status,
        note: order.note
      })
    }
  }
  return {
      workbook,
      status
  }
}

export const orderTrash = async (query: any) => {
  const find: any = {
    deleted: true
  }

  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex) {
    find["userInfo.phone"] = objectSearch.regex
  }
  // End search

  // Pagination
  const countOrders = await Order.countDocuments(find)

  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 10
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
    .populate('deletedBy.account_id', 'fullName email') // Lấy thông tin người tạo
    .lean()
  return {
      orders,
      objectSearch,
      objectPagination
  }
}

export const permanentlyDeleteOrder = async (id: string) => {
  return Order.deleteOne(
    { _id: id }
  )
}

export const recoverOrder = async (id: string) => {
  return Order.updateOne(
    { _id: id },
    { deleted: false, recoveredAt: new Date() }
  )
}