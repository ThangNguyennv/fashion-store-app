import User from '~/models/user.model'
import bcrypt from 'bcrypt'
import { UserInterface } from '~/interfaces/admin/user.interface'

export const getUsers = async () => {
  const users = await User.find({ deleted: false })
  return users
}

export const changeStatusUser = async (status: string, id: string) => {
  await User.updateOne(
    { _id: id }, 
    { $set: { status } }
  )
}

export const editUser = async (data: UserInterface, id: string) => {
  const dataTemp = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    phone: data.phone,
    avatar: data.avatar,
    address: data.address,
    status: data.status
  }
  const isEmailExist = await User.findOne({
    _id: { $ne: id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
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
  await User.updateOne({ _id: id }, { $set: dataTemp })
  return { success: true }
}

export const detailUser = async (user_id: string) => {
  const accountUser = await User.findOne({  _id: user_id, deleted: false })
  return accountUser
}

export const deleteUser = async (user_id: string) => {
  await User.updateOne(
    { _id: user_id }, 
    { $set: { deleted: true, deletedAt: new Date() } }
  )
}