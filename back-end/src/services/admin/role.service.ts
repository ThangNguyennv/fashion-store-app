import Role from '~/models/role.model'
import Account from '~/models/account.model'
import { RoleInterface } from '~/interfaces/admin/role.interface'

export const getRoles = async () => {
  const roles = await Role.find({ deleted: false })

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

  const accounts = await Account.find({ deleted: false })

  return { roles, accounts }
}

export const createRole = async (data: RoleInterface) => {
  const dataTemp = {
    title: data.title,
    titleId: data.titleId,
    description: data.description
  }
  const role = new Role(dataTemp)
  await role.save()
  const roleToObject = role.toObject()

  return roleToObject
}

export const editRole = async (account_id: string, role_id: string, data: RoleInterface) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  const dataTemp = {
    title: data.title,
    titleId: data.titleId,
    description: data.description
  }
  await Role.updateOne(
    { _id: role_id },
    {
      $set: dataTemp,
      $push: { updatedBy }
    }
  )
}

export const deleteRole = async (role_id: string, account_id: string) => {
  await Role.updateOne(
    { _id: role_id },
    {
      $set: {
        deleted: true,
        deletedBy: {
          account_id: account_id,
          deletedAt: new Date()
        }
      }
    }
  )
}

export const detailRole = async (role_id: string) => {
  const role = await Role.findOne({ _id: role_id, deleted: false })
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
      { $set: { permissions: item.permissions }}
    )
  }
}