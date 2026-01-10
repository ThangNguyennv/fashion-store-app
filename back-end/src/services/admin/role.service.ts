import Role from '~/models/role.model'
import Account from '~/models/account.model'

export const getRoles = async () => {
  const find = {
    deleted: false
  }

  const roles = await Role.find(find)
  for (const record of roles) {
    // Lấy ra thông tin người cập nhật
    const updatedBy = record.updatedBy[record.updatedBy.length - 1] // Lấy phần tử cuối của mảng updatedBy
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id
      })
      updatedBy['accountFullName'] = userUpdated.fullName
    }
  }

  const accounts = await Account.find({
    deleted: false
  })
  return {
    roles,
    accounts
  }
}

export const createRole = async (data: any) => {
  const role = new Role(data)
  await role.save()
  return role
}

export const editRole = async (account_id: string, id: string, data: any) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  await Role.updateOne(
    { _id: id },
    {
      ...data,
      $push: {
        updatedBy: updatedBy
      }
    }
  )
}

export const deleteRole = async (id: string, account_id: string) => {
  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: account_id,
        deletedAt: new Date()
      }
    }
  )
}

export const detailRole = async (id: string) => {
  const find = {
    deleted: false,
    _id: id
  }
  const role = await Role.findOne(find)
  return role
}

export const permissionsPatch = async (permissionRequireList: any) => {
  for (const item of permissionRequireList) {
    const existing = await Role.findById(item._id)
    if (!existing) {
      continue
    }
      await Role.updateOne(
      { _id: item._id },
      { permissions: item.permissions }
    )
  }
}