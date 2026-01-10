import { Request, Response } from 'express'
import * as brandService from '~/services/admin/brand.service'
import { StatusCodes } from 'http-status-codes'

// [GET] /admin/brands
export const index = async (req: Request, res: Response) => {
  try {
    const { brands, objectPagination } = await brandService.getBrands(req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      brands: brands,
      pagination: objectPagination
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/brands/create
export const createBrand = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.createBrand(
        req.body, 
        req['accountAdmin'].id
    )

    res.status(StatusCodes.CREATED).json({ 
        code: 201, 
        message: 'Tạo mới thương hiệu thành công!', 
        data: brand 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/brands/detail/:id
export const detailBrand = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.detailBrand(req.params.id)

    res.status(StatusCodes.OK).json({ 
        code: 200, 
        message: 'Thành công!', 
        brand: brand 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/brands/edit/:id
export const editBrand = async (req: Request, res: Response) => {
  try {
    await brandService.editBrand(req.body, req.params.id, req['accountAdmin'].id)

    res.status(StatusCodes.OK).json({ 
        code: 200, 
        message: 'Cập nhật thành công!' 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/brands/delete/:id
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    await brandService.deleteBrand(req.params.id, req['accountAdmin'].id)

    res.status(StatusCodes.NO_CONTENT).json({ 
        code: 204, 
        message: 'Xóa thành công!' 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
