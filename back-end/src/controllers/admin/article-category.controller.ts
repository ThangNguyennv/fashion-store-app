import { Request, Response } from 'express'
import ArticleCategory from '~/models/article-category.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import searchHelpers from '~/helpers/search'
import { buildTree, TreeItem } from '~/helpers/createTree'
import { addLogInfoToTree, LogNode } from '~/helpers/addLogInfoToChildren'
import paginationHelpers from '~/helpers/pagination'
import { buildTreeForPagedItems } from '~/helpers/createChildForParent'
import Account from '~/models/account.model'
import { deleteManyStatusFast, updateManyStatusFast, updateStatusRecursiveForOneItem } from '~/helpers/updateStatusRecursive'

// [GET] /admin/articles-category
export const index = async (req: Request, res: Response) => {
  try {
    const find: any = { deleted: false }
    if (req.query.status) {
      find.status = req.query.status.toString()
    }

    // Search
    const objectSearch = searchHelpers(req.query)
    if (objectSearch.regex || objectSearch.slug) {
      find.$or = [
        { title: objectSearch.regex },
        { slug: objectSearch.slug }
      ]
    }
    // End search

    // Sort
    let sort: Record<string, 1 | -1> = { }
    if (req.query.sortKey) {
      const key = req.query.sortKey.toString()
      const dir = req.query.sortValue === 'asc' ? 1 : -1
      sort[key] = dir
    }
    // luôn sort phụ theo createdAt
    if (!sort.createdAt) {
      sort.createdAt = -1
    }
    // End Sort

    // Pagination
    const parentFind = { ...find, parent_id: '' }
    const countParents = await ArticleCategory.countDocuments(parentFind)
    const objectPagination = paginationHelpers(
      {
        currentPage: 1,
        limitItems: 3
      },
      req.query,
      countParents
    )
    // End Pagination
    
    //  Query song song bằng Promise.all (giảm round-trip)
    const [parentCategories, accounts, allCategories] = await Promise.all([
      ArticleCategory.find(parentFind)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip) // chỉ parent
        .lean(),
      Account
        .find({ deleted: false }) // account info
        .lean(),
      ArticleCategory
        .find({ deleted: false })
        .sort(sort)
        .lean()
    ])

    // Tạo cây phân cấp
    const newArticleCategories = buildTreeForPagedItems(parentCategories as unknown as TreeItem[], allCategories as unknown as TreeItem[])
    const newAllArticleCategories = buildTree(allCategories as unknown as TreeItem[])

    // Gắn account info cho tree
    const accountMap = new Map(accounts.map(acc => [acc._id.toString(), acc.fullName]))
    addLogInfoToTree(newArticleCategories as LogNode[], accountMap)
    addLogInfoToTree(newAllArticleCategories as LogNode[], accountMap)

    res.json({
      code: 200,
      message: 'Thành công!',
      articleCategories: newArticleCategories,
      allArticleCategories: newAllArticleCategories,
      accounts: accounts,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
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

export interface UpdatedBy {
  account_id: string,
  updatedAt: Date
}

export const changeStatusWithChildren = async (req: Request, res: Response) => {
   try {
    const { status, id } = req.params;
    const updatedBy: UpdatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }

    await updateStatusRecursiveForOneItem(ArticleCategory, status, id, updatedBy)

    return res.json({ 
      code: 200, 
      message: "Cập nhật thành công trạng thái danh mục bài viết!" 
    });
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/articles-category/change-multi
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
        await updateManyStatusFast(ArticleCategory, Key.ACTIVE, ids, updatedBy)
        res.json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục bài viết!`
        })
        break
      case Key.INACTIVE:
        await updateManyStatusFast(ArticleCategory, Key.INACTIVE, ids, updatedBy)
        res.json({
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
        res.json({
          code: 404,
          message: 'Không tồn tại danh mục bài viết!'
        })
        break
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [DELETE] /admin/articles-category/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id

    await ArticleCategory.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: req['accountAdmin'].id,
          deletedAt: new Date()
        }
      }
    )
    res.json({
      code: 204,
      message: 'Xóa thành công danh mục bài viết!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /admin/articles-category/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.createdBy = {
      account_id: req['accountAdmin'].id
    }

    const records = new ArticleCategory(req.body)
    await records.save()

    res.json({
      code: 201,
      message: 'Thêm thành công danh mục bài viết!',
      data: records
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/articles-category/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await ArticleCategory.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy
        }
      }
    )
    res.json({
      code: 200,
      message: 'Cập nhật thành công danh mục bài viết!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/articles-category/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const articleCategory = await ArticleCategory.findOne(find)
    res.json({
      code: 200,
      message: 'Lấy Thành công chi tiết danh mục bài viết!',
      articleCategory: articleCategory
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
