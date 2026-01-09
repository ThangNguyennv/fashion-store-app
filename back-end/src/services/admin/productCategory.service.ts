import { Request, Response } from 'express'
import ProductCategory from '~/models/productCategory.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import searchHelpers from '~/helpers/search'
import { buildTree, TreeItem } from '~/helpers/createTree'
import { buildTreeForPagedItems } from '~/helpers/createChildForParent'
import { addLogInfoToTree, LogNode } from '~/helpers/addLogInfoToChildren'
import Account from '~/models/account.model'
import paginationHelpers from '~/helpers/pagination'
import { deleteManyStatusFast, updateManyStatusFast, updateStatusRecursiveForOneItem } from '~/helpers/updateStatusRecursive'

export const getProductCategories = async (query: any) => {
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
    const countParents = await ProductCategory.countDocuments(parentFind)
    const objectPagination = paginationHelpers(
      { 
        currentPage: 1, 
        limitItems: 2 
      },
      query,
      countParents
    )
    // End Pagination

    //  Query song song bằng Promise.all (giảm round-trip)
    const [parentCategories, accounts, allCategories] = await Promise.all([
      ProductCategory
        .find(parentFind)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip) // chỉ parent
        .lean(),
      Account
        .find({ deleted: false }) // account info
        .lean(),
      ProductCategory
        .find({ deleted: false })
        .sort(sort) 
        .lean()
    ])
    
    // Add children vào cha (Đã phân trang giới hạn 2 item)
    const newProductCategories = buildTreeForPagedItems(parentCategories as unknown as TreeItem[], allCategories as unknown as TreeItem[])
  
    // Add children vào cha (Không có phân trang, lấy tất cả item)
    const newAllProductCategories = buildTree(allCategories as unknown as TreeItem[])

    // Gắn account info cho tree
    const accountMap = new Map(accounts.map(acc => [acc._id.toString(), acc.fullName]))
    addLogInfoToTree(newProductCategories as LogNode[], accountMap)
    addLogInfoToTree(newAllProductCategories as LogNode[], accountMap)
    return {
        newProductCategories,
        newAllProductCategories,
        accounts,
        objectSearch,
        objectPagination
    }
}

export interface UpdatedBy {
  account_id: string,
  updatedAt: Date
}

export const changeStatusWithChildren = async (accoutn_id: string, status: string, id: string) => {
    const updatedBy: UpdatedBy = {
      account_id: accoutn_id,
      updatedAt: new Date()
    }

    return await updateStatusRecursiveForOneItem(ProductCategory, status, id, updatedBy)
}

export const deleteProductCategory = async (id: string, account_id: string) => {
    return await ProductCategory.updateOne(
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

export const createProductCategory = async (data: any, account_id: string) => {
    data.createdBy = {
        account_id: account_id
    }
    const records = new ProductCategory(data)
    await records.save()
    return records
}

export const editProductCategory = async (data: any, id: string, account_id: string) => {
    const updatedBy = {
      account_id: account_id,
      updatedAt: new Date()
    }
    return await ProductCategory.updateOne(
      { _id: id },
      {
        ...data,
        $push: {
          updatedBy: updatedBy
        }
      }
    )
}

export const detailProductCategory = async (id: string) => {
    const find = {
      deleted: false,
      _id: id
    }
    const productCategory = await ProductCategory.findOne(find)
    return productCategory
}

export const productCategoryTrash = async (query: any) => {
    const find: any = { deleted: true }

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
    // const parentFind = { ...find, parent_id: '' }

    const countParents = await ProductCategory.countDocuments(find)
    const objectPagination = paginationHelpers(
      { 
        currentPage: 1, 
        limitItems: 2 
      },
      query,
      countParents
    )
    // End Pagination

    //  Query song song bằng Promise.all (giảm round-trip)
    const [parentCategories, accounts] = await Promise.all([
      ProductCategory
        .find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip) // chỉ parent
        .lean(),
      Account
        .find({ deleted: false }) // account info
        .lean()
    ])
    return {
        parentCategories,
        accounts,
        objectSearch,
        objectPagination
    }
}

export const permanentlyDeleteProductCategory = async (id: string) => {
    // Lấy danh mục gốc cần xóa
    const rootCategory = await ProductCategory.findOne({ _id: id })
    
    if (!rootCategory) {
        const error: any = new Error('Không tìm thấy danh mục!')
        error.statusCode = 404
        throw error
    }
    
    // Lấy tất cả danh mục để tìm con
    const allCategories = await ProductCategory.find({})
    
    // Tạo cây từ danh mục gốc
    const tree = buildTreeForPagedItems(
      [rootCategory as any as TreeItem], 
      allCategories as any as TreeItem[]
    )
    
    // Hàm đệ quy lấy tất cả ID từ cây
    const getAllIdsFromTree = (items: TreeItem[]): string[] => {
      let ids: string[] = []
      
      items.forEach(item => {
        const itemId = item._id?.toString() || item.id?.toString()
        if (itemId) {
          ids.push(itemId)
        }
        
        if (item.children && item.children.length > 0) {
          ids = ids.concat(getAllIdsFromTree(item.children))
        }
      })
      
      return ids
    }
    
    // Lấy tất cả ID cần xóa
    const allIdsToDelete = getAllIdsFromTree(tree)
    
    // Xóa tất cả danh mục
    await ProductCategory.deleteMany({
      _id: { $in: allIdsToDelete }
    })
    return allIdsToDelete
}

export const recoverProductCategory = async (id: string) => {
    return await ProductCategory.updateOne(
          { _id: id },
          { deleted: false, recoveredAt: new Date() }
        )
}