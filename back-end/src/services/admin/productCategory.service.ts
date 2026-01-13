import ProductCategory from '~/models/productCategory.model'
import searchHelpers from '~/helpers/search'
import { buildTreeForPagedItems } from '~/helpers/createChildForPagedParents'
import { addLogInfoToTree } from '~/helpers/addLogInfoToChildren'
import Account from '~/models/account.model'
import paginationHelpers from '~/helpers/pagination'
import { updateStatusRecursiveForOneItem } from '~/helpers/updateStatusItem'
import { buildTreeForItems } from '~/helpers/createChildForAllParents'
import { LogNodeInterface, TreeInterface, UpdatedBy } from '~/interfaces/admin/general.interface'
import { string } from 'joi'
import { ProductCategoryInterface } from '~/interfaces/admin/productCategory.interface'

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
  const newProductCategories = buildTreeForPagedItems(parentCategories as unknown as TreeInterface[], allCategories as unknown as TreeInterface[])

  // Add children vào cha (Không có phân trang, lấy tất cả item)
  const newAllProductCategories = buildTreeForItems(allCategories as unknown as TreeInterface[])

  // Gắn account info cho tree
  const accountMap = new Map(accounts.map(acc => [acc._id.toString(), acc.fullName]))
  addLogInfoToTree(newProductCategories as LogNodeInterface[], accountMap)
  addLogInfoToTree(newAllProductCategories as LogNodeInterface[], accountMap)
  
  return {
    newProductCategories,
    newAllProductCategories,
    accounts,
    objectSearch,
    objectPagination
  }
}



export const changeStatusWithChildren = async (accoutn_id: string, status: string, id: string) => {
  const updatedBy: UpdatedBy = {
    account_id: accoutn_id,
    updatedAt: new Date()
  }

  await updateStatusRecursiveForOneItem(ProductCategory, status, id, updatedBy)
}

export const deleteProductCategory = async (id: string, account_id: string) => {
  await ProductCategory.updateOne(
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

export const createProductCategory = async (data: ProductCategoryInterface, account_id: string) => {
  const dataTemp = {
    title: data.title,
    parent_id: data.parent_id,
    description: data.description,
    status: data.status,
    thumbnail: data.thumbnail,
    createdBy: {
      account_id
    }
  }
  const productCategory = new ProductCategory(dataTemp)
  await productCategory.save()
  const productCategoryToObject = productCategory.toObject()

  return productCategoryToObject
}

export const editProductCategory = async (data: ProductCategoryInterface, id: string, account_id: string) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  const dataTemp = {
    title: data.title,
    parent_id: data.parent_id,
    description: data.description,
    status: data.status,
    thumbnail: data.thumbnail
  }
  await ProductCategory.updateOne(
    { _id: id },
    {
      $set: dataTemp,
      $push: { updatedBy }
    }
  )
}

export const detailProductCategory = async (id: string) => {
  const productCategory = await ProductCategory.findOne({ _id: id, deleted: false })
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
  const rootCategory = await ProductCategory.findOne({ _id: id }).lean()
  
  if (!rootCategory) {
    return { 
      success: false, 
      code: 404, 
      message: 'Không tìm thấy danh mục!' 
    }
  }
  
  // Lấy tất cả danh mục để tìm con
  const allCategories = await ProductCategory.find({}).lean()
  
  // Tạo cây từ danh mục gốc
  const tree = buildTreeForPagedItems(
    [rootCategory as any as TreeInterface], allCategories as any as TreeInterface[]
  )
  
  // Hàm đệ quy lấy tất cả ID từ cây
  const getAllIdsFromTree = (items: TreeInterface[]): string[] => {
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

  return { success: true, allIdsToDelete }
}

export const recoverProductCategory = async (id: string) => {
  await ProductCategory.updateOne(
    { _id: id },
    { $set: { deleted: false, recoveredAt: new Date() }}
  )
}