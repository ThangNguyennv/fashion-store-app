export interface TreeInterface {
  _id: any
  parent_id: string
  [key: string]: any
  index?: number
  children?: TreeInterface[]
}

interface UserLogInterface {
  account_id: string
  fullName: string
}

export interface LogNodeInterface extends TreeInterface {
  createdBy?: UserLogInterface
  lastUpdatedBy?: UserLogInterface & { updatedAt?: string }
}

export interface UpdatedBy {
  account_id: string,
  updatedAt: Date
}