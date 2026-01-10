import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as statisticService from '~/services/admin/statistic.service'

// [GET] /admin/statistics
export const statistic = async (req: Request, res: Response) => {
  try {
    const {
      statistic,
      labels,
      data
    } = await statisticService.getStatistic() 
    
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      statistic: statistic,
      labels: labels,
      data: data
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
