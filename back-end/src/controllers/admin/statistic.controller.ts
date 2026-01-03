import { Request, Response } from 'express'
import Product from '~/models/product.model'
import User from '~/models/user.model'
import Order from '~/models/order.model'

// [GET] /admin/statistics
export const statistic = async (req: Request, res: Response) => {
  try {
    const statistic = {
      user: {
        total: 0,
      },
      product: {
        total: 0,
      },
      order: {
        total: 0,
      },
      revenue: {
        total: 0,
      }
    }
    const result = await Order.aggregate([
      { $match: { "paymentInfo.status": "PAID" } }, // chỉ tính đơn đã thanh toán
      {
        $group: {
          _id: { $month: "$createdAt" },            // group theo tháng
          totalRevenue: { $sum: "$amount" }     // cộng dồn doanh thu
        }
      },
      { $sort: { "_id": 1 } } // sắp xếp theo tháng tăng dần
    ])
  
    const currentMonth = new Date().getMonth() + 1
    const currentMonthData = result.find(r => r._id === currentMonth)
    const currentMonthRevenue = currentMonthData ? currentMonthData.totalRevenue : 0

    const labels = result.map(month => `Tháng ${month._id}`)
    const data = result.map(revenue => revenue.totalRevenue)
  
    statistic.user.total = await User.countDocuments({
      deleted: false
    })

    statistic.product.total = await Product.countDocuments({
      deleted: false
    })

    statistic.order.total = await Order.countDocuments({
      deleted: false
    })

    statistic.revenue.total = currentMonthRevenue

    res.json({
      code: 200,
      message: 'Thành công!',
      statistic: statistic,
      labels: labels,
      data: data
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
