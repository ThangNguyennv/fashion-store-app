import searchHelpers from '~/helpers/search'
import { buildTreeForItems } from '~/helpers/createChildForAllParents'
import { addLogInfoToTree } from '~/helpers/addLogInfoToChildren'
import paginationHelpers from '~/helpers/pagination'
import { buildTreeForPagedItems } from '~/helpers/createChildForPagedParents'
import Account from '~/models/account.model'
import ArticleCategory from '~/models/articleCategory.model'
import { updateStatusRecursiveForOneItem } from '~/helpers/updateStatusItem'
import { LogNodeInterface, TreeInterface } from '~/interfaces/admin/general.interface'
import { ArticleCategoryInterface } from '~/interfaces/admin/articleCategory.interface'

export const getArticleCategories = async (query: any) => {
  const find: any = { deleted: false }
  if (query.status) {
    find.status = query.status.toString()
  }

  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex || objectSearch.slug) {
    find.$or = [
      { title: objectSearch.regex },
      { slug: objectSearch.slug }
    ]
  }
  // End search

  // Sort
  let sort: Record<string, 1 | -1> = { }
  if (query.sortKey) {
    const key = query.sortKey.toString()
    const dir = query.sortValue === 'asc' ? 1 : -1
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
    query,
    countParents
  )
  // End Pagination
  
  //  Query song song bằng Promise.all (giảm round-trip)
  // parentCategories: Các danh mục bài viết cấp cao nhất (Cấp 1) (đã được phân trang)
  // allCategories: Tất cả các danh mục bài viết cấp cao nhất (Cấp 1)
  const [parentCategories, accounts, allCategories] = await Promise.all([
    ArticleCategory.find(parentFind)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .lean(),
    Account
      .find({ deleted: false })
      .lean(),
    ArticleCategory
      .find({ deleted: false })
      .sort(sort)
      .lean()
  ])

  // Tạo cây phân cấp (Mỗi cha sẽ được gán thêm trường children)
  const articleCategories = buildTreeForPagedItems(parentCategories as unknown as TreeInterface[], allCategories as unknown as TreeInterface[])

  // Tạo cây phân cấp (Mỗi cha sẽ được gán thêm trường children)
  const allArticleCategories = buildTreeForItems(allCategories as unknown as TreeInterface[])

  // Gán account info cho tree
  const accountMap = new Map(accounts.map(acc => [acc._id.toString(), acc.fullName]))
  addLogInfoToTree(articleCategories as LogNodeInterface[], accountMap)
  addLogInfoToTree(allArticleCategories as LogNodeInterface[], accountMap)

  return {
    articleCategories,
    allArticleCategories,
    accounts,
    objectSearch,
    objectPagination
  }
}

export const changeStatusWithChildren = async (status: string, category_id: string, account_id: string) => {
  const updatedBy = {
    account_id,
    updatedAt: new Date()
  }
  
  await updateStatusRecursiveForOneItem(ArticleCategory, status, category_id, updatedBy)
}

export const deleteArticleCategory = async (id: string, account_id: string) => {
  await ArticleCategory.updateOne(
    { _id: id },
    {
      $set: {
        deleted: true,
        deletedBy: {
          account_id: account_id,
          deletedAt: new Date()
        }
      }
    }
  )
}

export const createArticleCategory = async (data: ArticleCategoryInterface, account_id: string) => {
  const dataTemp = {
    title: data.title,
    parent_id: data.parent_id,
    descriptionShort: data.descriptionShort,
    descriptionDetail: data.descriptionDetail,
    status: data.status,
    thumbnail: data.thumbnail,
    createdBy: {
      account_id
    }
  }
  const articleCategory = new ArticleCategory(dataTemp)
  await articleCategory.save()
  const articleCategoryToObject = articleCategory.toObject()

  return articleCategoryToObject
}

export const editArticleCategory = async (data: any, id: string, account_id: string) => {
  const updatedBy = {
    account_id,
    updatedAt: new Date()
  }
  const dataTemp = {
    title: data.title,
    parent_id: data.parent_id,
    descriptionShort: data.descriptionShort,
    descriptionDetail: data.descriptionDetail,
    status: data.status,
    thumbnail: data.thumbnail
  }
  await ArticleCategory.updateOne(
    { _id: id },
    {
      $set: dataTemp,
      $push: {
        updatedBy
      }
    }
  )
}

export const detailArticleCategory = async (id: string) => {
  const articleCategory = await ArticleCategory
    .findOne({ _id: id, deleted: false })
    .lean()
    
  return articleCategory
}