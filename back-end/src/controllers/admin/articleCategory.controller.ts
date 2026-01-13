import { Request, Response } from 'express'
import ArticleCategory from '~/models/articleCategory.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import { deleteManyStatusFast, updateManyStatusFast } from '~/helpers/updateStatusItem'
import * as articleCategoryService from '~/services/admin/articleCategory.service'
import { StatusCodes } from 'http-status-codes'

// [GET] /admin/articles-category
export const index = async (req: Request, res: Response) => {
  try {
    const { 
      articleCategories,
      allArticleCategories,
      accounts,
      objectSearch,
      objectPagination 
    } = await articleCategoryService.getArticleCategories(req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      articleCategories: articleCategories,
      allArticleCategories: allArticleCategories,
      accounts: accounts,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// // [PATCH] /admin/articles-category/change-status/:status/:id
// export const changeStatus = async (req: Request, res: Response) => {
//   try {
//     const status: string = req.params.status
//     const id: string = req.params.id
//     const updatedBy = {
//       account_id: req['accountAdmin'].id,
//       updatedAt: new Date()
//     }
//     await ArticleCategory.updateOne(
//       { _id: id },
//       { status: status, $push: { updatedBy: updatedBy } }
//     )

//     res.json({
//       code: 200,
//       message: 'Cập nhật thành công trạng thái danh mục bài viết!'
//     })
//   } catch (error) {
//     res.json({
//       code: 400,
//       message: 'Lỗi!',
//       error: error
//     })
//   }
// }



export const changeStatusWithChildren = async (req: Request, res: Response) => {
   try {
    await articleCategoryService.changeStatusWithChildren(
      req.params.status, 
      req.params.id, 
      req['accountAdmin'].id
    )

    return res.status(StatusCodes.OK).json({ 
      code: 200, 
      message: "Cập nhật thành công trạng thái danh mục bài viết!" 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/articles-category/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] }
    const type = body.type
    const ids = body.ids // Chứa tất cả id cả cha và con đã được front-end gửi lên
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
        await updateManyStatusFast(ArticleCategory, Key.ACTIVE, ids, updatedBy)
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục bài viết!`
        })
        break
      case Key.INACTIVE:
        await updateManyStatusFast(ArticleCategory, Key.INACTIVE, ids, updatedBy)
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục bài viết!`
        })
        break
      case Key.DELETEALL:
        await deleteManyStatusFast(ArticleCategory, ids)
        res.json({
          code: 204,
          message: `Xóa thành công ${ids.length} danh mục bài viết!`
        })
        break
      default:
        res.status(StatusCodes.NOT_FOUND).json({
          code: 404,
          message: 'Không tồn tại danh mục bài viết!'
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

// [DELETE] /admin/articles-category/delete/:id
export const deleteArticleCategory = async (req: Request, res: Response) => {
  try {
    await articleCategoryService.deleteArticleCategory(req.params.id, req['accountAdmin'].id)

    res.json({
      code: 204,
      message: 'Xóa thành công danh mục bài viết!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/articles-category/create
export const createArticleCategory = async (req: Request, res: Response) => {
  try {
    const articleCategoryToObject = await articleCategoryService.createArticleCategory(req.body, req['accountAdmin'].id)

    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Thêm thành công danh mục bài viết!',
      data: articleCategoryToObject
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/articles-category/edit/:id
export const editArticleCategory = async (req: Request, res: Response) => {
  try {
    await articleCategoryService.editArticleCategory(req.body, req.params.id, req['accountAdmin'].id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công danh mục bài viết!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/articles-category/detail/:id
export const detailArticleCategory = async (req: Request, res: Response) => {
  try {
    const articleCategory = await articleCategoryService.detailArticleCategory(req.params.id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy Thành công chi tiết danh mục bài viết!',
      articleCategory: articleCategory
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
