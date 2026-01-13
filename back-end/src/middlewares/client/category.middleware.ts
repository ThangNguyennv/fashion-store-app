import { Request, Response, NextFunction } from 'express'
import ProductCategory from '~/models/productCategory.model'
import ArticleCategory from '~/models/articleCategory.model'
import { buildTreeForItems } from '~/helpers/createChildForAllParents'
import { TreeInterface } from '~/interfaces/admin/general.interface'

export const categoryProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productsCategory = await ProductCategory.find({
    deleted: false
  }).lean()
  const newProductsCategory = buildTreeForItems(productsCategory as unknown as TreeInterface[])
  req['layoutProductsCategory'] = newProductsCategory 
  next()
}

export const categoryArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const articlesCategory = await ArticleCategory.find({
    deleted: false
  }).lean()
  const newArticlesCategory = buildTreeForItems(articlesCategory as unknown as TreeInterface[])
  req['layoutArticlesCategory'] = newArticlesCategory
  next()
}
