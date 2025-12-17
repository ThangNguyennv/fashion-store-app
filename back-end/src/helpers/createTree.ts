export interface TreeItem {
  _id: any
  parent_id: string
  [key: string]: any
  index?: number
  children?: TreeItem[]
}

let count = 0

export const createTree = (parentItems: TreeItem[], parentId: string = ''): TreeItem[] => {
  const tree: TreeItem[] = []

  parentItems.forEach((item) => {
    const itemId = item._id?.toString() || ''
    if (item.parent_id === parentId) {
      count++
      const newItem = { ...item, index: count } as TreeItem
      
      const children = createTree(parentItems, itemId)
      if (children.length > 0) {
        newItem.children = children
      }
      tree.push(newItem)
    }
  })
  return tree
}

export const buildTree = (parentItems: TreeItem[], parentId: string = ''): TreeItem[] => {
  count = 0
  return createTree(parentItems, parentId)
}
