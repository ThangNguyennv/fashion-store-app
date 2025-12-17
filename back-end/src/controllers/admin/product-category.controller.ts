import { Request, Response } from 'express'
import ProductCategory from '~/models/product-category.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import searchHelpers from '~/helpers/search'
import { buildTree, TreeItem } from '~/helpers/createTree'
import { buildTreeForPagedItems } from '~/helpers/createChildForParent'
import { addLogInfoToTree, LogNode } from '~/helpers/addLogInfoToChildren'
import Account from '~/models/account.model'
import paginationHelpers from '~/helpers/pagination'
import { deleteManyStatusFast, updateManyStatusFast, updateStatusRecursiveForOneItem } from '~/helpers/updateStatusRecursive'

// [GET] /admin/products-category
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
    const countParents = await ProductCategory.countDocuments(parentFind)
    const objectPagination = paginationHelpers(
      { 
        currentPage: 1, 
        limitItems: 2 
      },
      req.query,
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

    res.json({
      code: 200,
      message: 'Thành công!',
      productCategories: newProductCategories,
      allProductCategories: newAllProductCategories,
      accounts: accounts,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
    })
  }
}

// // [PATCH] /admin/products-category/change-status/:status/:id
// export const changeStatus = async (req: Request, res: Response) => {
//   try {
//     const status = req.params.status
//     const id = req.params.id
//     const updatedBy = {
//       account_id: req['accountAdmin'].id,
//       updatedAt: new Date()
//     }
//     await ProductCategory.updateOne(
//       { _id: id },
//       { status: status, $push: { updatedBy: updatedBy } }
//     )
//     res.json({
//       code: 200,
//       message: 'Cập nhật trạng thái danh mục sản phẩm thành công !'
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

// [PATCH] /admin/change-status-with-children/:status/:id
export const changeStatusWithChildren = async (req: Request, res: Response) => {
   try {
    const { status, id } = req.params
    const updatedBy: UpdatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }

    await updateStatusRecursiveForOneItem(ProductCategory, status, id, updatedBy)

    return res.json({ 
      code: 200, 
      message: "Cập nhật thành công trạng thái danh mục sản phẩm!" 
    });
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/products-category/change-multi
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
        await updateManyStatusFast(ProductCategory, Key.ACTIVE, ids, updatedBy)

        res.json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục sản phẩm!`
        })
        break
      case Key.INACTIVE:
        await updateManyStatusFast(ProductCategory, Key.INACTIVE, ids, updatedBy)
        res.json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục sản phẩm!`
        })
        break
      case Key.DELETEALL:
        await deleteManyStatusFast(ProductCategory, ids)
        res.json({
          code: 204,
          message: `Xóa thành công ${ids.length} danh mục sản phẩm!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại danh mục sản phẩm!'
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

// [DELETE] /admin/products-category/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    await ProductCategory.updateOne(
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
      message: 'Xóa thành công danh mục sản phẩm!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /admin/products-category/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.createdBy = {
      account_id: req['accountAdmin'].id
    }
    const records = new ProductCategory(req.body)
    await records.save()
    res.json({
      code: 201,
      message: 'Thêm thành công danh mục sản phẩm!',
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

// [PATCH] /admin/products-category/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await ProductCategory.updateOne(
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
      message: 'Cập nhật thành công danh mục sản phẩm!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/products-category/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const productCategory = await ProductCategory.findOne(find)
    res.json({
      code: 200,
      message: 'Lấy Thành công chi tiết danh mục sản phẩm!',
      productCategory: productCategory
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/products-category/trash
export const ProductCategoryTrash = async (req: Request, res: Response) => {
  try {
    const find: any = { deleted: true }

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
    // const parentFind = { ...find, parent_id: '' }

    const countParents = await ProductCategory.countDocuments(find)
    const objectPagination = paginationHelpers(
      { 
        currentPage: 1, 
        limitItems: 2 
      },
      req.query,
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
    
    // // Add children vào cha (Đã phân trang giới hạn 2 item)
    // const newProductCategories = buildTreeForPagedItems(parentCategories as unknown as TreeItem[], allCategories as unknown as TreeItem[])
  
    // // Add children vào cha (Không có phân trang, lấy tất cả item)
    // const newAllProductCategories = buildTree(allCategories as unknown as TreeItem[])

    // // Gắn account info cho tree
    // const accountMap = new Map(accounts.map(acc => [acc._id.toString(), acc.fullName]))
    // addLogInfoToTree(newProductCategories as LogNode[], accountMap)
    // addLogInfoToTree(newAllProductCategories as LogNode[], accountMap)

    res.json({
      code: 200,
      message: 'Thành công!',
      productCategories: parentCategories,
      accounts: accounts,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/products-category/trash/form-change-multi-trash
export const changeMultiTrash = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] }
    const type = body.type
    const ids = body.ids
    enum Key {
      DELETEALL = 'DELETEALL',
      RECOVER = 'RECOVER',
    }
    switch (type) {
      case Key.DELETEALL:
        // Lấy tất cả danh mục để tìm con
        const allCategories = await ProductCategory.find({})
        
        // Hàm đệ quy lấy tất cả ID từ cây
        const getAllIdsFromTree = (items: TreeItem[]): string[] => {
          let idList: string[] = []
          
          items.forEach(item => {
            const itemId = item._id?.toString() || item.id?.toString()
            if (itemId) {
              idList.push(itemId)
            }
            
            if (item.children && item.children.length > 0) {
              idList = idList.concat(getAllIdsFromTree(item.children))
            }
          })
          
          return idList
        }
        
        // Lấy tất cả ID cần xóa (bao gồm con)
        let allIdsToDelete: string[] = []
        
        for (const id of ids) {
          const category = await ProductCategory.findOne({ _id: id })
          
          if (category) {
            // Tạo cây cho từng danh mục
            const tree = buildTreeForPagedItems(
              [category as any as TreeItem],
              allCategories as any as TreeItem[]
            )
            
            // Lấy tất cả ID từ cây
            const categoryIds = getAllIdsFromTree(tree)
            allIdsToDelete = allIdsToDelete.concat(categoryIds)
          }
        }
        
        // Loại bỏ ID trùng lặp
        allIdsToDelete = [...new Set(allIdsToDelete)]
        
        // Xóa tất cả danh mục
        await ProductCategory.deleteMany({ _id: { $in: allIdsToDelete } })
        
        res.json({
          code: 204,
          message: `Đã xóa vĩnh viễn thành công ${allIdsToDelete.length} danh mục (bao gồm ${ids.length} danh mục đã chọn và các danh mục con)!`
        })
        break
      case Key.RECOVER:
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { deleted: false, recoveredAt: new Date() })
        res.json({
          code: 200,
          message: `Khôi phục thành công ${ids.length} danh mục sản phẩm!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại!'
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

// [DELETE] /admin/products-category/trash/permanentlyDelete/:id
export const permanentlyDeleteProductCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    
    // Lấy danh mục gốc cần xóa
    const rootCategory = await ProductCategory.findOne({ _id: id })
    
    if (!rootCategory) {
      return res.json({
        code: 404,
        message: 'Không tìm thấy danh mục!'
      })
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
    
    res.json({
      code: 204,
      message: `Đã xóa vĩnh viễn ${allIdsToDelete.length} danh mục (bao gồm danh mục con)!`
    })
  } catch (error) {
    
    res.json({
      code: 400,
      message: 'Lỗi khi xóa danh mục!',
      error: error
    })
  }
}

// [PATCH] /admin/products-category/trash/recover/:id
export const recoverProductCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    
    await ProductCategory.updateOne(
      { _id: id },
      { deleted: false, recoveredAt: new Date() }
    )
    res.json({
      code: 200,
      message: 'Đã khôi phục thành công danh mục sản phẩm!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}