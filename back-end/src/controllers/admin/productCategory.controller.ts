import { Request, Response } from 'express'
import ProductCategory from '~/models/productCategory.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import searchHelpers from '~/helpers/search'
import { TreeItem } from '~/helpers/createTree'
import { buildTreeForPagedItems } from '~/helpers/createChildForParent'
import Account from '~/models/account.model'
import paginationHelpers from '~/helpers/pagination'
import { deleteManyStatusFast, updateManyStatusFast, updateStatusRecursiveForOneItem } from '~/helpers/updateStatusRecursive'
import * as productCategoryService from '~/services/admin/productCategory.service'

// [GET] /admin/products-category
export const index = async (req: Request, res: Response) => {
  try {
    const {
      newProductCategories,
      newAllProductCategories,
      accounts,
      objectSearch,
      objectPagination
    } = await productCategoryService.getProductCategories(req.query)

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



// [PATCH] /admin/change-status-with-children/:status/:id
export const changeStatusWithChildren = async (req: Request, res: Response) => {
   try {
    await productCategoryService.changeStatusWithChildren(
      req['accountAdmin'].id, 
      req.params.status, 
      req.params.id
    )

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
export const deleteProductCategory = async (req: Request, res: Response) => {
  try {
    await productCategoryService.deleteProductCategory(req.params.id, req['accountAdmin'].id)

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
export const createProductCategory = async (req: Request, res: Response) => {
  try {
    const records = await productCategoryService.createProductCategory(req.body, req['accountAdmin'].id)

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
export const editProductCategory = async (req: Request, res: Response) => {
  try {
    await productCategoryService.editProductCategory(
      req.body, 
      req.params.id, 
      req['accountAdmin'].id
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
export const detailProductCategory = async (req: Request, res: Response) => {
  try {
    const productCategory = await productCategoryService.detailProductCategory(req.params.id)

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
export const productCategoryTrash = async (req: Request, res: Response) => {
  try {
    const {
      parentCategories,
      accounts,
      objectSearch,
      objectPagination
    } = await productCategoryService.productCategoryTrash(req.query)

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
    const allIdsToDelete = await productCategoryService.permanentlyDeleteProductCategory(req.params.id)

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
    await productCategoryService.recoverProductCategory(req.params.id)
    
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