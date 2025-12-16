import { TreeItem } from './createTree'

let count = 0

// Hàm tạo cây: tìm con trong allItems, gốc lấy từ parentItems
export const createTree = (parentItems: TreeItem[], allItems: TreeItem[]): TreeItem[] => {
  const tree: TreeItem[] = []

  parentItems.forEach((item) => {
    count++
    // convert Mongoose Document thành object JS thuần (bỏ các method, getter đặc biệt, metadata của Mongoose)
    let plainItem = item.toObject ? item.toObject() : item
    const newItem = { ...plainItem, index: count } as TreeItem

    // Tìm con trong toàn bộ danh sách
    const children = allItems.filter(child => child.parent_id === item.id)

    if (children.length > 0) {
      newItem.children = createTree(children, allItems)
    }

    tree.push(newItem)
  })

  return tree
}

// Hàm gọi ngoài
export const buildTreeForPagedItems = (
  parentItems: TreeItem[],  // các cha (có thể phân trang)
  allItems: TreeItem[]       // toàn bộ dữ liệu
): TreeItem[] => {
  count = 0
  return createTree(parentItems, allItems)
}
