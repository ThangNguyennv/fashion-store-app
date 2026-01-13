import Account from "~/models/account.model"
import bcrypt from 'bcrypt'
import Role from "~/models/role.model"
import { AccountInterface } from "~/interfaces/admin/account.interface"

export const getAccountsWithRoles = async () => {
    const accounts = await Account
        .find({ deleted: false })
        .populate('role_id')
        .lean()
    const roles = await Role
        .find({ deleted: false })
        .lean()

    return { accounts, roles }
}

export const createAccount = async (data: AccountInterface) => {
    const dataTemp = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        avatar: data.avatar,
        role_id: data.role_id,
        status: data.status
    }

    const isEmailExist = await Account.findOne({ 
        email: dataTemp.email, 
        deleted: false 
    })
    if (isEmailExist) {
        return { 
            success: false, 
            code: 409, 
            message: `Email ${dataTemp.email} đã tồn tại`
        }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(dataTemp.password, salt)

    const account = new Account({
        ...dataTemp,
        password: hashedPassword // Ghi đè lên password cũ
    })
    await account.save()
    const accountToObject = account.toObject()
    delete accountToObject.password

    return { success: true, accountToObject }
}

export const changeStatusAccount = async (status: string, account_id: string) => {
    await Account.updateOne(
        { _id: account_id }, 
        { $set: { status } }
    )
}

export const editAccount = async (data: AccountInterface, account_id: string) => {
    const dataTemp = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        avatar: data.avatar,
        role_id: data.role_id,
        status: data.status
    }

    const isEmailExist = await Account.findOne({
      _id: { $ne: account_id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: dataTemp.email,
      deleted: false
    })
    if (isEmailExist) {
        return { 
            success: false, 
            code: 409, 
            message: `Email ${dataTemp.email} đã tồn tại`
        }
    }

    if (dataTemp.password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(dataTemp.password, salt)
        dataTemp.password = hashedPassword
    } else {
        delete dataTemp.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
    }
    await Account.updateOne(
        { _id: account_id }, 
        { $set: dataTemp }
    )

    return { success: true }
}

export const detailAccount = async (account_id: string) => {
    const account = await Account
        .findOne({ _id: account_id, deleted: false })
        .populate('role_id')
        .lean()

    const roles = await Role
        .find({ deleted: false })
        .lean()

    return { account, roles }
}

export const deleteAccount = async (account_id: string) => {
    await Account.updateOne(
      { _id: account_id },
      { $set: { deleted: true, deletedAt: new Date() } }
    )
}
