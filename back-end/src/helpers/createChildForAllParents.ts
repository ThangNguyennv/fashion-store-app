import { TreeInterface } from "~/interfaces/admin/general.interface"

let count = 0

export const createTree = (parentItems: TreeInterface[], parentId: string = ''): TreeInterface[] => {
  const tree: TreeInterface[] = []

  parentItems.forEach((item) => {
    const itemId = item._id?.toString() || ''
    if (item.parent_id === parentId) {
      count++
      const newItem = { ...item, index: count } as TreeInterface
      
      const children = createTree(parentItems, itemId)
      if (children.length > 0) {
        newItem.children = children
      }
      tree.push(newItem)
    }
  })
  return tree
}

export const buildTreeForItems = (parentItems: TreeInterface[], parentId: string = ''): TreeInterface[] => {
  count = 0
  return createTree(parentItems, parentId)
}
