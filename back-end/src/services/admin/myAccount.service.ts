import Account from '~/models/account.model'
import Role from '~/models/role.model'
import bcrypt from 'bcrypt'

export const getMyAccount = async (account_id: string) => {
  const myAccount = await Account.findOne({ 
    _id: account_id, 
    deleted: false 
  })
  const role = await Role.findOne({ 
    _id: myAccount.role_id, 
    deleted: false 
  })
  return {
    myAccount,
    role
  }
}

export const editMyAccount = async (data: any, account_id: string) => {
  const { email, password } = data
  const isEmailExist = await Account.findOne({
    _id: { $ne: account_id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
    email: email,
    deleted: false
  })

  if (!isEmailExist) {
    return { 
      success: false, 
      code: 409, 
      message: `Email ${email} đã tồn tại, vui lòng chọn email khác!`
    }
  } 

  if (password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    data.password = hashedPassword
  } else {
    delete data.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
  }
  await Account.updateOne({ _id: account_id }, data)
  return {
    success: true
  }
}