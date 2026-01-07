import { Request, Response } from 'express'
import Brand from '~/models/brand.model'
import paginationHelpers from '~/helpers/pagination'
import searchHelpers from '~/helpers/search'
import * as brandService from '~/services/admin/brand.service'

// [GET] /admin/brands
export const index = async (req: Request, res: Response) => {
  try {
    const { brands, objectPagination } = await brandService.getBrands(req.query)

    res.json({
      code: 200,
      message: 'Thành công!',
      brands: brands,
      pagination: objectPagination
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}

// [POST] /admin/brands/create
export const createBrand = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.createBrand(req.body, req['accountAdmin'].id)

    res.json({ code: 201, message: 'Tạo mới thương hiệu thành công!', data: brand })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}

// [GET] /admin/brands/detail/:id
export const detailBrand = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.detailBrand(req.params.id)

    res.json({ code: 200, message: 'Thành công!', brand: brand })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}

// [PATCH] /admin/brands/edit/:id
export const editBrand = async (req: Request, res: Response) => {
  try {
    await brandService.editBrand(req.body, req.params.id, req['accountAdmin'].id)

    res.json({ code: 200, message: 'Cập nhật thành công!' })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message });
  }
}

// [DELETE] /admin/brands/delete/:id
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    await brandService.deleteBrand(req.params.id, req['accountAdmin'].id)

    res.json({ code: 200, message: 'Xóa thành công!' })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}
