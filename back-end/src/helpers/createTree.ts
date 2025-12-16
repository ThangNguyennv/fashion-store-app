import { Document } from 'mongoose'

export interface TreeItem extends Document {
  id: string
  parent_id: string
  [key: string]: unknown
  index?: number
  children?: TreeItem[]
}

let count = 0

export const createTree = (parentItems: TreeItem[], parentId: string = ''): TreeItem[] => {
  const tree: TreeItem[] = []

  parentItems.forEach((item) => {
    if (item.parent_id === parentId) {
      count++
      const newItem = { ...item.toObject(), index: count } as TreeItem
      const children = createTree(parentItems, item.id)
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
