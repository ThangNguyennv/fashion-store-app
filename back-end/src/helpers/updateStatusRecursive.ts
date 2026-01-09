import { UpdatedBy } from "~/services/admin/productCategory.service"

export const updateStatusRecursiveForOneItem = async (model: any, status: string, id: string, currentUser: UpdatedBy): Promise<void> => {
  const stack = [id]
  while (stack.length > 0) {
    const currentId = stack.pop()!

    await model.updateOne(
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
    const children = await model.find(
      { parent_id: currentId },
      { _id: 1 } // Chỉ lần id
    )

    for (const child of children) {
      stack.push(child._id.toString())
    }
  }
}


export const updateManyStatusFast = async (model: any, status: string, ids: string[], currentUser: UpdatedBy): Promise<void> => {
  // Dùng Set để lọc trùng ID (đề phòng Frontend gửi trùng)
  const uniqueIds = [...new Set(ids)]

  // Thực hiện Update 1 lần cho tất cả
  await model.updateMany(
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

export const deleteManyStatusFast = async (model: any, ids: string[]): Promise<void> => {
  // Dùng Set để lọc trùng ID (đề phòng Frontend gửi trùng)
  const uniqueIds = [...new Set(ids)]

  // Thực hiện Update 1 lần cho tất cả
  await model.updateMany(
    { _id: { $in: uniqueIds } },
    { deleted: 'true', deletedAt: new Date() }
  )
}