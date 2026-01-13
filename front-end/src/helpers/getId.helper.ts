/* eslint-disable @typescript-eslint/no-explicit-any */
// export const updateStatusRecursiveForProduct = (
//   categories: ProductCategoryInfoInterface[],
//   targetId: string,
//   newStatus: string,
//   currentUser: UpdatedBy
// ): ProductCategoryInfoInterface[] => {
//   return categories.map(category => {
//     // Nếu là category cần cập nhật
//     if (category._id === targetId) {
//       return {
//         ...category,
//         status: newStatus,
//         updatedBy: [...(category.updatedBy || []), currentUser],
//         // Cập nhật TẤT CẢ children
//         children: category.children
//           ? updateAllChildrenStatus(category.children, newStatus, currentUser)
//           : []
//       }
//     }
//     // Nếu không phải, tiếp tục tìm trong children
//     return {
//       ...category,
//       children: category.children
//         ? updateStatusRecursiveForProduct(category.children, targetId, newStatus, currentUser)
//         : []
//     }
//   })
// }

// const updateAllChildrenStatus = (
//   categories: ProductCategoryInfoInterface[],
//   newStatus: string,
//   currentUser: UpdatedBy
// ): ProductCategoryInfoInterface[] => {
//   return categories.map(category => ({
//     ...category,
//     status: newStatus,
//     updatedBy: [...(category.updatedBy || []), currentUser],
//     children: category.children
//       ? updateAllChildrenStatus(category.children, newStatus, currentUser)
//       : []
//   }))
// }

// Helper: Tìm node và trả về mảng gồm ID của nó và tất cả ID con cháu
export const getFamilyIds = (nodes: any[], targetId: string): string[] => {
  const ids: string[] = []

  const findAndCollect = (list: any[]) => {
    for (const node of list) {
      if (node._id === targetId) {
        // Đã tìm thấy cha, bắt đầu thu thập ID của nó và toàn bộ con cháu
        const collectIds = (item: any) => {
          if (item._id) ids.push(item._id)
          if (item.children && item.children.length > 0) {
            item.children.forEach((child: any) => collectIds(child))
          }
        }
        collectIds(node)
        return true // Dừng tìm kiếm ở nhánh này
      }

      // Nếu chưa thấy, tìm tiếp trong children
      if (node.children && node.children.length > 0) {
        const found = findAndCollect(node.children)
        if (found) return true
      }
    }
    return false
  }

  findAndCollect(nodes)
  return ids
}

// Helper: Lấy TOÀN BỘ ID trong cây (Dùng cho check all)
export const getAllIdsInTree = (nodes: any[]): string[] => {
  let ids: string[] = []
  nodes.forEach(node => {
    if (node._id) ids.push(node._id)
    if (node.children && node.children.length > 0) {
      ids = [...ids, ...getAllIdsInTree(node.children)]
    }
  })
  return ids
}