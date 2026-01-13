import Account from '~/models/account.model'
import Role from '~/models/role.model'
import bcrypt from 'bcrypt'
import { MyAccountInterface } from '~/interfaces/admin/myAccount.interface'

export const getMyAccount = async (account_id: string) => {
  const myAccount = await Account.findOne({ 
    _id: account_id, 
    deleted: false 
  })
  const role = await Role.findOne({ 
    _id: myAccount.role_id, 
    deleted: false 
  })
  return { myAccount, role }
}

export const editMyAccount = async (data: MyAccountInterface, account_id: string) => {
  const dataTemp = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    phone: data.phone,
    avatar: data.avatar
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
      message: `Email ${dataTemp.email} đã tồn tại, vui lòng chọn email khác!`
    }
  } 

  if (dataTemp.password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(dataTemp.password, salt)
    dataTemp.password = hashedPassword
  } else {
    delete dataTemp.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
  }
  await Account.updateOne({ _id: account_id }, dataTemp)
  
  return { success: true }
}