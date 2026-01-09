import { Request, Response } from 'express'
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
    
    res.json({
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
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
