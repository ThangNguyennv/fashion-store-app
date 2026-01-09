import User from '~/models/user.model'
import bcrypt from 'bcrypt'

export const getUsers = async () => {
    const find = {
      deleted: false
    }
    const users = await User.find(find)
    return users
}

export const changeStatusUser = async (status: string, id: string) => {
    return User.updateOne({ _id: id }, { status: status })
}

export const editUser = async (data: any, id: string) => {
    const { email, password } = data
    const isEmailExist = await User.findOne({
      _id: { $ne: id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: email,
      deleted: false
    })
    if (isEmailExist) {
      const error: any = new Error(`Email ${email} đã tồn tại`)
      error.statusCode = 409
      throw error
    } 
    if (password) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      data.password = hashedPassword
    } else {
      delete data.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
    }
    await User.updateOne({ _id: id }, data)
}

export const detailUser = async (id: string) => {
    const find = {
      deleted: false,
      _id: id
    }
    const accountUser = await User.findOne(find)
    return accountUser
}

export const deleteUser = async (id: string) => {
    return User.updateOne(
        { _id: id }, 
        { deleted: true, deletedAt: new Date() }
    )
}