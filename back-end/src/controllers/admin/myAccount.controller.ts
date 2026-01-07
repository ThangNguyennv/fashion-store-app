import { Request, Response } from 'express'
import Account from '~/models/account.model'
import Role from '~/models/role.model'
import bcrypt from 'bcrypt'

// [GET] /admin/my-account
export const index = async (req: Request, res: Response) => {
  try {
    const myAccount = await Account.findOne({ 
      _id: req['accountAdmin']._id, 
      deleted: false 
    })
    const role = await Role.findOne({ 
      _id: myAccount.role_id, 
      deleted: false 
    })
    res.json({
      code: 200,
      message: 'Thành công!',
      myAccount: myAccount,
      role: role
    })

  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/my-account/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const isEmailExist = await Account.findOne({
      _id: { $ne: req['accountAdmin'].id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
      email: email,
      deleted: false
    })
    if (isEmailExist) {
      res.json({
        code: 409,
        message: `Email ${email} đã tồn tại, vui lòng chọn email khác!`
      })
      return
    } 
    if (password) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      req.body.password = hashedPassword
    } else {
      delete req.body.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
    }
    await Account.updateOne({ _id: req['accountAdmin'].id }, req.body)
    res.json({
      code: 200,
      message: 'Cập nhật thành công tài khoản!'
    })
    
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
