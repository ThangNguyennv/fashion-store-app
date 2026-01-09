import { Request, Response } from 'express'
import filterOrderHelpers from '~/helpers/filterOrder'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import Order from '~/models/order.model'
import ExcelJS from 'exceljs'
import * as orderService from '~/services/admin/order.service'

// [GET] /admin/orders
export const index = async (req: Request, res: Response) => {
  try {
    const {
        orders,
        allOrders,
        objectSearch,
        objectPagination
    } = await orderService.getOrders(req.query)

    res.json({
      code: 200,
      message: 'Trả về orders thành công!',
      orders: orders,
      filterOrder: filterOrderHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination,
      allOrders: allOrders, // Tất cả những order ban đầu chưa có phân trang
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/change-status/:status/:id
export const changeStatusOrder = async (req: Request, res: Response) => {
  try {
    const updater = await orderService.changeStatusOrder(
      req.params.status, 
      req.params.id, 
      req['accountAdmin'].id
    )

    res.json({
      code: 200,
      message: 'Cập nhật trạng thái thành công đơn hàng!',
      updater: updater
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] }
    const type = body.type
    const ids = body.ids
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    enum Key {
      PENDING = 'PENDING',
      CONFIRMED = 'CONFIRMED',
      TRANSPORTING = 'TRANSPORTING',
      CANCELED = 'CANCELED',
      DELETEALL = 'DELETEALL',
    }
    switch (type) {
      case Key.PENDING:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.PENDING, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        })
        break
      case Key.TRANSPORTING:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.TRANSPORTING, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        })
        break
      case Key.CONFIRMED:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.CONFIRMED, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        })
        break
      case Key.CANCELED:
        await Order.updateMany(
          { _id: { $in: ids } },
          { status: Key.CANCELED, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
        })
        break
      case Key.DELETEALL:
        await Order.updateMany(
          { _id: { $in: ids } },
          { deleted: 'true', deletedAt: new Date() }
        )
        res.json({
          code: 204,
          message: `Đã xóa thành công ${ids.length} đơn hàng!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại đơn hàng!'
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

// [DELETE] /admin/orders/delete/:id
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await orderService.deleteOrder(req.params.id, req['accountAdmin'].id)

    res.json({
      code: 204,
      message: 'Đã xóa thành công đơn hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}



// [GET] /admin/orders/detail/:id
export const detailOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.detailOrder(req.params.id)

    res.json({
      code: 200,
      message: 'Chi tiết đơn hàng!',
      order: order
    })
    
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/edit-estimatedDeliveryDay
export const estimatedDeliveryDay = async (req: Request, res: Response) => {
  try {
    await orderService.estimatedDeliveryDay(req.body, req['accountAdmin'].id)

    res.json({
      code: 200,
      message: `Cập nhật thành công thời gian giao hàng!`
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/edit-estimatedConfirmedDay
export const estimatedConfirmedDay = async (req: Request, res: Response) => {
  try {
    await orderService.estimatedConfirmedDay(req.body, req['accountAdmin'].id)

    res.json({
      code: 200,
      message: `Cập nhật thành công thời gian nhận hàng!`
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/orders/export
export const exportOrder = async (req: Request, res: Response) => {
  try {
    const { workbook, status } = await orderService.exportOrder(req.query)

    // Gửi file về cho client
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="don-hang-${status || 'all'}-${new Date().getTime()}.xlsx`
    )

    // Ghi workbook vào response
    await workbook.xlsx.write(res)
    res.end()

  } catch (error) {
    console.error("Lỗi khi xuất Excel:", error)
    res.status(500).json({ 
      code: 500, 
      message: "Lỗi máy chủ khi xuất file", 
      error: error.message 
    })
  }
}

// [GET] /admin/orders/trash
export const orderTrash = async (req: Request, res: Response) => {
  try {
    const { 
      orders,
      objectSearch,
      objectPagination
    } = await orderService.orderTrash(req.query)

    res.json({
      code: 200,
      message: 'Trả orderTrash thành công!',
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

// [PATCH] /admin/orders/trash/form-change-multi-trash
export const changeMultiTrash = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] }
    const type = body.type
    const ids = body.ids
    enum Key {
      DELETEALL = 'DELETEALL',
      RECOVER = 'RECOVER',
    }
    switch (type) {
      case Key.DELETEALL:
        await Order.deleteMany({ _id: { $in: ids } })
        res.json({
          code: 204,
          message: `Đã xóa vĩnh viễn thành công ${ids.length} đơn hàng!`
        })
        break
      case Key.RECOVER:
        await Order.updateMany(
          { _id: { $in: ids } },
          { deleted: false, recoveredAt: new Date() }
        )
        res.json({
          code: 200,
          message: `Đã khôi phục thành công ${ids.length} đơn hàng!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại!'
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

// [DELETE] /admin/orders/trash/permanentlyDelete/:id
export const permanentlyDeleteOrder = async (req: Request, res: Response) => {
  try {
    await orderService.permanentlyDeleteOrder(req.params.id)

    res.json({
      code: 204,
      message: 'Đã xóa vĩnh viễn thành công đơn hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/orders/trash/recover/:id
export const recoverOrder = async (req: Request, res: Response) => {
  try {
    await orderService.recoverOrder(req.params.id)
    
    res.json({
      code: 200,
      message: 'Đã khôi phục thành công đơn hàng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}