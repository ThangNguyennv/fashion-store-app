import Account from "~/models/account.model"
import bcrypt from 'bcrypt'
import Role from "~/models/role.model"

export const getAccountsWithRoles = async () => {
    const accounts = await Account
        .find({ deleted: false })
        .populate('role_id')
        .lean()
    const roles = await Role.find({ deleted: false }).lean()
    return {
        accounts,
        roles
    }
}

interface CreateAccountInput {
  email: string
  password: string
  [key: string]: any
}

export const createAccount = async (data: CreateAccountInput) => {
    const { email, password } = data
    const isEmailExist = await Account.findOne({
      email,
      deleted: false
    })
    if (!isEmailExist) {
        return { 
            success: false, 
            code: 409, 
            message: `Email ${email} đã tồn tại`
        }
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const account = new Account({
        ...data,
        password: hashedPassword
    })

    await account.save()

    const newAccount = account.toObject()
    delete newAccount.password

    return {
        success: true,
        newAccount
    }
}

export const changeStatusAccount = async (status: string, id: string) => {
    await Account.updateOne({ _id: id }, { status: status })
}

export const editAccount = async (data: CreateAccountInput, id: string) => {
    const { email, password } = data
    const isEmailExist = await Account.findOne({
      _id: { $ne: id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: email,
      deleted: false
    })
    if (!isEmailExist) {
        return { 
            success: false, 
            code: 409, 
            message: `Email ${email} đã tồn tại`
        }
    }

    if (password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        data.password = hashedPassword
    } else {
        delete data.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
    }
    await Account.updateOne({ _id: id }, data)
    return {
        success: true
    }
}

export const detailAccount = async (id: string) => {
    const account = await Account.findOne({ 
        _id: id,
        deleted: false 
    }).populate('role_id').lean()
    const roles = await Role.find({ deleted: false }).lean()

    return {
        account,
        roles
    }
}

export const deleteAccount = async (id: string) => {
    await Account.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    )
}
