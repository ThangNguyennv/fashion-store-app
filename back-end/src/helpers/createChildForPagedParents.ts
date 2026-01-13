import { TreeInterface } from "~/interfaces/admin/general.interface"

let count = 0

// Hàm tạo cây: tìm con trong allItems, gốc lấy từ parentItems
export const createTree = (parentItems: TreeInterface[], allItems: TreeInterface[]): TreeInterface[] => {
  const tree: TreeInterface[] = []

  parentItems.forEach((item) => {
    count++
    // Gán thêm index vào mỗi item
    const newItem = { ...item, index: count } as TreeInterface
    const itemId = item._id?.toString() || ''

    // Tìm con trong toàn bộ danh sách
    // Trả về 1 mảng mới chứa các con có id === parent_id
    const children = allItems.filter(child => child.parent_id === itemId)

    if (children.length > 0) {
      // Gán children cho mỗi cha, đệ quy lặp lại cho đến khi gán hết
      newItem.children = createTree(children, allItems)
    }

    tree.push(newItem)
  })

  // Trả về 1 mảng chứa các cha đã có gán hết tất cả children
  return tree
}

// Hàm reset lại count = 0 mỗi lần chạy cho các item khác
export const buildTreeForPagedItems = (
  parentItems: TreeInterface[],  // các cha (đã được phân trang)
  allItems: TreeInterface[]       // toàn bộ dữ liệu
): TreeInterface[] => {
  count = 0
  return createTree(parentItems, allItems)
}
