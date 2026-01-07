import { Request, Response, NextFunction } from 'express'
import ProductCategory from '~/models/productCategory.model'
import ArticleCategory from '~/models/articleCategory.model'
import { buildTree, TreeItem } from '~/helpers/createTree'

export const categoryProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productsCategory = await ProductCategory.find({
    deleted: false
  }).lean()
  const newProductsCategory = buildTree(productsCategory as unknown as TreeItem[])
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
  const newArticlesCategory = buildTree(articlesCategory as unknown as TreeItem[])
  req['layoutArticlesCategory'] = newArticlesCategory
  next()
}
