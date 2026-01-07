import searchHelpers from '~/helpers/search'
import { buildTree, TreeItem } from '~/helpers/createTree'
import { addLogInfoToTree, LogNode } from '~/helpers/addLogInfoToChildren'
import paginationHelpers from '~/helpers/pagination'
import { buildTreeForPagedItems } from '~/helpers/createChildForParent'
import Account from '~/models/account.model'
import ArticleCategory from '~/models/articleCategory.model'
import { deleteManyStatusFast, updateManyStatusFast, updateStatusRecursiveForOneItem } from '~/helpers/updateStatusRecursive'

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

    return {
        newArticleCategories,
        newAllArticleCategories,
        accounts,
        objectSearch,
        objectPagination
    }
}

export interface UpdatedBy {
  account_id: string,
  updatedAt: Date
}

export const changeStatusWithChildren = async (status: string, id: string, account_id: string) => {
  const updatedBy: UpdatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  
  return await updateStatusRecursiveForOneItem(ArticleCategory, status, id, updatedBy)
}

export const deleteArticleCategory = async (id: string, account_id: string) => {
  return await ArticleCategory.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: account_id,
          deletedAt: new Date()
        }
      }
    )
}

export const createArticleCategory = async (data: any, account_id: string) => {
  data.createdBy = {
    account_id: account_id
  }

  const records = new ArticleCategory(data)
  await records.save()

  return records
}

export const editArticleCategory = async (data: any, id: string, account_id: string) => {
  const updatedBy = {
        account_id: account_id,
        updatedAt: new Date()
      }
  return await ArticleCategory.updateOne(
    { _id: id },
    {
      ...data,
      $push: {
        updatedBy: updatedBy
      }
    }
  )
}

export const detailArticleCategory = async (id: string) => {
  const find = {
    deleted: false,
    _id: id
  }

  const articleCategory = await ArticleCategory.findOne(find)
  return articleCategory
}