import { Request, Response } from 'express'
import Product from '~/models/product.model'
import User from '~/models/user.model'
import Order from '~/models/order.model'
import * as statisticService from '~/services/admin/statistic.service'

// [GET] /admin/statistics
export const statistic = async (req: Request, res: Response) => {
  try {
    const {
      statistic,
      labels,
      data
    } = await statisticService.getStatistic() 
    
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
