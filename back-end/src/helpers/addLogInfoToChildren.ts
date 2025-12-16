import { TreeItem } from './createTree'

interface UserRef {
  account_id: string
  accountFullName?: string
}

export interface LogNode extends TreeItem {
  createdBy: UserRef[]
  updatedBy: UserRef[]
  accountFullName?: string
}

//  Add thông tin cho mỗi node
export const addLogInfoToTree = async (nodes: LogNode[], accountMap: Map<string, string>): Promise<void> => {
  for (const node of nodes) {
    // Lấy thông tin người tạo
    const creator = node.createdBy?.[0]
    if (creator && accountMap.has(creator.account_id.toString())) {
      node.accountFullName = accountMap.get(creator.account_id.toString())
    }

    // Lấy thông tin người cập nhật gần nhất
    // const lastUpdater = node.updatedBy?.slice(-1)[0]
    const lastUpdater = node.updatedBy[node.updatedBy.length - 1]
    if (lastUpdater && accountMap.has(lastUpdater.account_id.toString())) {
      lastUpdater.accountFullName = accountMap.get(lastUpdater.account_id.toString())
    }

    // Đệ quy xử lý children
    if (node.children && node.children.length > 0) {
      await addLogInfoToTree(node.children as LogNode[], accountMap)
    }
  }
}
