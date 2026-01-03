import { Request, Response } from 'express'
import Account from '~/models/account.model'
import Role from '~/models/role.model';
import bcrypt from 'bcrypt'

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false
    }
    const accounts = await Account.find(find)
    for (const account of accounts) {
      const role = await Role.findOne({
        deleted: false,
        _id: account.role_id
      })
      account['role'] = role
    }
    const roles = await Role.find({
      deleted: false
    })
  
    res.json({
      code: 200,
      message: 'Thành công!',
      accounts: accounts,
      roles: roles
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const isEmailExist = await Account.findOne({
      email: email,
      deleted: false
    })
    if (isEmailExist) {
      res.json({
        code: 409,
        message: `Email ${email} đã tồn tại, vui lòng chọn email khác!`
      })
      return
    } else {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      req.body.password = hashedPassword
      const account = new Account(req.body)
      await account.save()

      res.json({
        code: 201,
        message: 'Thêm tài khoản thành công!',
        data: req.body,
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi',
      error: error
    })
  }
}

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status
    const id: string = req.params.id
    await Account.updateOne({ _id: id }, { status: status })
    res.json({
      code: 200,
      message: 'Cập nhật trạng thái thành công!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const isEmailExist = await Account.findOne({
      _id: { $ne: req.params.id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
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
    await Account.updateOne({ _id: req.params.id }, req.body)
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

// [GET] /admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const roles = await Role.find({
      deleted: false
    })
    const account = await Account.findOne(find)
    const role = await Role.findOne({
      deleted: false,
      _id: account.role_id
    })
    account['role'] = role
    res.json({
      code: 200,
      message: 'Thành công!',
      account: account,
      roles: roles
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [DELETE] /admin/accounts/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    await Account.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    )
    res.json({
      code: 204,
      message: 'Xóa thành công tài khoản!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
