import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as homeService from '~/services/client/home.service'

// [GET] /
export const index = async (req: Request, res: Response) => {
  try {
    const {
      newProductsFeatured,
      newProductsNew,
      articlesFeatured,
      articlesNew
    } = await homeService.home()
    
    res.status(StatusCodes.OK).json({
      code: 200,
      message: ' Thành công!',
      productsFeatured: newProductsFeatured,
      productsNew: newProductsNew,
      articlesFeatured: articlesFeatured,
      articlesNew: articlesNew,
      productCategories: req['layoutProductsCategory'],
      articleCategories: req['layoutArticlesCategory']
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
