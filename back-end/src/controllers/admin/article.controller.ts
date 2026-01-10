import { Request, Response } from 'express'
import Article from '~/models/article.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import * as articleService from '~/services/admin/article.service'
import { StatusCodes } from 'http-status-codes'

// [GET] /admin/articles
export const index = async (req: Request, res: Response) => {
  // Bộ lọc
  try {
    const {
      articles,
      objectSearch,
      objectPagination,
      allArticles
    } = await articleService.getArticles(req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      articles: articles,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
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

// [POST] /admin/articles/create
export const createArticle = async (req: Request, res: Response) => {
  try {
    const article = await articleService.createArticle(req.body, req['accountAdmin'].id)

    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Thêm thành công bài viết!',
      data: article,
    })
  } catch (error) {
   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/articles/detail/:id
export const detailArticle = async (req: Request, res: Response) => {
  try {
    const article = await articleService.detailArticle(req.params.id)

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

// [PATCH] /admin/articles/edit/:id
export const editArticle = async (req: Request, res: Response) => {
  try {
    await articleService.editArticle(req.body, req.params.id, req['accountAdmin'].id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công bài viết!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/articles/change-status/:status/:id
export const changeStatusArticle = async (req: Request, res: Response) => {
  try {
    const updater = await articleService.changeStatusArticle(
      req.params.status, 
      req.params.id, 
      req['accountAdmin'].id
    )

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công trạng thái bài viết!',
      updater: updater
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/articles/change-multi
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
        await Article.updateMany(
          { _id: { $in: ids } },
          { status: Key.ACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} bài viết!`
        })
        break
      case Key.INACTIVE:
        await Article.updateMany(
          { _id: { $in: ids } },
          { status: Key.INACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} bài viết!`
        })
        break
      case Key.DELETEALL:
        await Article.updateMany(
          { _id: { $in: ids } },
          { deleted: 'true', deletedAt: new Date() }
        )
        res.status(StatusCodes.NO_CONTENT).json({
          code: 204,
          message: `Xóa thành công ${ids.length} bài viết!`
        })
        break
      default:
        res.status(StatusCodes.NOT_FOUND).json({
          code: 404,
          message: 'Không tồn tại bài viết!'
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

// [DELETE] /admin/articles/delete/:id
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    await articleService.deleteArticle(req.params.id, req['accountAdmin'].id)
    
    res.status(StatusCodes.NO_CONTENT).json({
      code: 204,
      message: 'Xóa thành công bài viết!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
