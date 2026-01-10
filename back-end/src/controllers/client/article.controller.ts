import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as articleService from '~/services/client/article.service'

// [GET] /articles
export const index = async (req: Request, res: Response) => {
  try {
    const {
      articles,
      objectPagination,
      allArticles
    } = await articleService.getArticles(req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      articles: articles,
      pagination: objectPagination,
      allArticles: allArticles
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })  
  }
}

// [GET] /articles/:slugCategory
export const category = async (req: Request, res: Response) => {
  try {
    const { articles, category } = await articleService.category(req.params.slugCategory)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      articles: articles,
      pageTitle: category.title
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })  
  }
}

// [GET] /articles/detail/:slugArticle
export const detailArticle = async (req: Request, res: Response) => {
  try {
    const article = await articleService.detailArticle(req.params.slugArticle)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      article: article
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })  
  }
}
