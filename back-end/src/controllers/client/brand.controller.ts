import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as brandService from '~/services/client/brand.service'

// [GET] /brands
export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await brandService.getAllBrands()

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy danh sách thương hiệu thành công!',
      brands: brands
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
