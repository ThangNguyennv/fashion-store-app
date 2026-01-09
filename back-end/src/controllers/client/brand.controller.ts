import { Request, Response } from 'express'
import * as brandService from '~/services/client/brand.service'

// [GET] /brands
export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await brandService.getAllBrands()

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
