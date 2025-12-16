import ProductCategory from "~/models/product-category.model"
import { UpdatedBy } from "~/controllers/admin/product-category.controller"

export const updateStatusRecursiveForOneItem = async (status: string, id: string, currentUser: UpdatedBy): Promise<void> => {
  const stack = [id]
  while (stack.length > 0) {
    const currentId = stack.pop()!

    await ProductCategory.updateOne(
      { _id: currentId },
      { 
        status: status, 
        $push: {
          updatedBy: {
            account_id: currentUser.account_id,
            updatedAt: currentUser.updatedAt
          }
        }
      }
    ) 
    const children = await ProductCategory.find(
      { parent_id: currentId },
      { _id: 1 } // Chỉ lần id
    )

    for (const child of children) {
      stack.push(child._id.toString())
    }
  }
}


export const updateManyStatusFast = async (status: string, ids: string[], currentUser: UpdatedBy): Promise<void> => {
  // Dùng Set để lọc trùng ID (đề phòng Frontend gửi trùng)
  const uniqueIds = [...new Set(ids)]

  // Thực hiện Update 1 lần cho tất cả
  await ProductCategory.updateMany(
    { 
      _id: { $in: uniqueIds } // Tìm tất cả thằng nào có ID nằm trong danh sách này
    },
    { 
      $set: { status: status }, // Set trạng thái mới
      $push: { // Push log người sửa
        updatedBy: {
          account_id: currentUser.account_id,
          updatedAt: currentUser.updatedAt
        }
      }
    }
  )
}

export const deleteManyStatusFast = async (ids: string[]): Promise<void> => {
  // Dùng Set để lọc trùng ID (đề phòng Frontend gửi trùng)
  const uniqueIds = [...new Set(ids)]

  // Thực hiện Update 1 lần cho tất cả
  await ProductCategory.updateMany(
    { _id: { $in: uniqueIds } },
    { deleted: 'true', deletedAt: new Date() }
  )
}