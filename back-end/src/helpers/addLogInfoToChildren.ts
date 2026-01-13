import { LogNodeInterface } from "~/interfaces/admin/general.interface"

export const addLogInfoToTree =  (
  nodes: LogNodeInterface[],
  accountMap: Map<string, string>
): void => {
  for (const node of nodes) {
    // Người tạo
    if (node.createdBy?.account_id) {
      const id = node.createdBy.account_id.toString()
      node.createdBy.fullName = accountMap.get(id) || 'Không xác định'
    }

    // Người cập nhật gần nhất
    if (node.updatedBy?.length) {
      const last = node.updatedBy[node.updatedBy.length - 1]
      const id = last.account_id.toString()

      node.lastUpdatedBy = {
        account_id: last.account_id,
        fullName: accountMap.get(id) || 'Không xác định',
        updatedAt: last.updatedAt
      }
    }

    // Đệ quy children
    if (node.children?.length) {
      addLogInfoToTree(node.children as LogNodeInterface[], accountMap)
    }
  }
}
