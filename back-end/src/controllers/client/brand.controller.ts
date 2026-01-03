import { Request, Response } from 'express'
import paginationHelpers from '~/helpers/pagination'
import Brand from '~/models/brand.model'

// [GET] /brands
export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const find: any = { deleted: false }
 
    const brands = await Brand
      .find(find)
      .sort({ position: 'desc' })
      .lean()

    res.json({
      code: 200,
      message: 'Lấy danh sách thương hiệu thành công!',
      brands: brands
    })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thương hiệu:", error)
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}
