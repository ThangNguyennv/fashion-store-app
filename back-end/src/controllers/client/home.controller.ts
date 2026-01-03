import { Request, Response } from 'express'
import Product from '~/models/product.model'
import Article from '~/models/article.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'

// [GET] /
export const index = async (req: Request, res: Response) => {
  try {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
      featured: '1',
      deleted: false,
      status: 'ACTIVE'
    })
      .sort({ createdAt: -1 })
      .limit(6)

    const newProductsFeatured = productsHelper.priceNewProducts(
      productsFeatured as OneProduct[]
    )

    // Lấy ra sản phẩm mới nhất
    const productsNew = await Product.find({
      deleted: false,
      status: 'ACTIVE'
    })
      .sort({ createdAt: -1 })
      .limit(6)

    const newProductsNew = productsHelper.priceNewProducts(
      productsNew as OneProduct[]
    )

    // Lấy ra bài viết nổi bật
    const articlesFeatured = await Article.find({
      featured: '1',
      deleted: false,
      status: 'ACTIVE'
    })
      .sort({ createdAt: -1 })
      .limit(5)

    // Lấy ra bài viết mới nhất
    const articlesNew = await Article.find({
      deleted: false,
      status: 'ACTIVE'
    })
      .sort({ createdAt: -1 })
      .limit(5)
    
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
