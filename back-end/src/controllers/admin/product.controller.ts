import { Request, Response } from 'express'
import Product from '~/models/product.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import * as productService from '~/services/admin/product.service'
import { StatusCodes } from 'http-status-codes'

// [GET] /admin/products
export const index = async (req: Request, res: Response) => {
  try {
    const {
      products,
      allProducts,
      objectSearch,
      objectPagination
    } = await productService.getProducts(req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      products: products,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination,
      allProducts: allProducts
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/products/change-status/:status/:id
export const changeStatusProduct = async (req: Request, res: Response) => {
  try {
    const updater = await productService.changeStatusProduct(
      req.params.id, 
      req.params.status, 
      req['accountAdmin'].id
    )

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công trạng thái sản phẩm!',
      updater: updater
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/products/change-multi
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
      ACTIVE = 'ACTIVE',
      INACTIVE = 'INACTIVE',
      DELETEALL = 'DELETEALL',
    }
    switch (type) {
      case Key.ACTIVE:
        await Product.updateMany(
          { _id: { $in: ids } },
          { status: Key.ACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} sản phẩm!`
        })
        break
      case Key.INACTIVE:
        await Product.updateMany(
          { _id: { $in: ids } },
          { status: Key.INACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} sản phẩm!`
        })
        break
      case Key.DELETEALL:
        await Product.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() }
        )
        res.status(StatusCodes.NO_CONTENT).json({
          code: 204,
          message: `Xóa thành công ${ids.length} sản phẩm!`
        })
        break
      default:
        res.status(StatusCodes.NOT_FOUND).json({
          code: 404,
          message: 'Không tồn tại sản phẩm!'
        })
        break
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/products/delete/:id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(req.params.id, req['accountAdmin'].id)

    res.status(StatusCodes.NO_CONTENT).json({
      code: 204,
      message: 'Xóa thành công sản phẩm!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/products/create
export const createProduct = async (req: Request, res: Response) => {
  try {
    const records = await productService.createProduct(
      req.body, 
      req['accountAdmin'].id, 
      req['fileUrls']
    )

    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Thêm thành công sản phẩm!',
      data: records,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/products/edit/:id
export const editProduct = async (req: Request, res: Response) => {
  try {
    await productService.editProduct(
      req.body, 
      req['accountAdmin'].id,
      req.params.id,
      req['fileUrls']
    )

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công sản phẩm!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/products/detail/:id
export const detaiProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.detaiProduct(req.params.id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy thành công chi tiết sản phẩm!',
      product: product
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/products/trash
export const productTrash = async (req: Request, res: Response) => {
  try {
    const {
      products,
      objectSearch,
      objectPagination
    } = await productService.productTrash(req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Trả productTrash thành công!',
      products: products,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/products/trash/form-change-multi-trash
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
        await Product.deleteMany({ _id: { $in: ids } })
        res.status(StatusCodes.NO_CONTENT).json({
          code: 204,
          message: `Đã xóa vĩnh viễn thành công ${ids.length} sản phẩm!`
        })
        break
      case Key.RECOVER:
        await Product.updateMany(
          { _id: { $in: ids } },
          { deleted: false, recoveredAt: new Date() }
        )
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Đã khôi phục thành công ${ids.length} sản phẩm!`
        })
        break
      default:
        res.status(StatusCodes.NOT_FOUND).json({
          code: 404,
          message: 'Không tồn tại!'
        })
        break
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/products/trash/permanentlyDelete/:id
export const permanentlyDeleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.permanentlyDeleteProduct(req.params.id)

    res.status(StatusCodes.NO_CONTENT).json({
      code: 204,
      message: 'Đã xóa vĩnh viễn thành công sản phẩm!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/products/trash/recover/:id
export const recoverProduct = async (req: Request, res: Response) => {
  try {
    await productService.recoverProduct(req.params.id)
    
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Đã khôi phục thành công sản phẩm!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}