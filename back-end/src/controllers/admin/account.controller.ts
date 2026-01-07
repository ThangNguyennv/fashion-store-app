import { Request, Response } from 'express'
import Account from '~/models/account.model'
import * as accountService from '~/services/account.service'

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  try {
    const { accounts, roles } = await accountService.getAccountsWithRoles()
  
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
export const createAccount = async (req: Request, res: Response) => {
  try {
    const account = await accountService.createAccount(req.body)
    res.json({
      code: 201,
      message: 'Thêm tài khoản thành công!',
      data: account,
    })
  } catch (error) {
    res.json({
      code: error.statusCode || 400,
      message: error.message || 'Lỗi',
      error: error
    })
  }
}

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeStatusAccount = async (req: Request, res: Response) => {
  try {
    await accountService.changeStatusAccount(req.params.status, req.params.id)
    
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
export const editAccount = async (req: Request, res: Response) => {
  try {
    await accountService.editAccount(req.body, req.params.id)

    res.json({
      code: 200,
      message: 'Cập nhật thành công tài khoản!'
    })
  } catch (error) {
    res.json({
      code: error.statusCode || 400,
      message: error.message || 'Lỗi',
      error: error
    })
  }
}

// [GET] /admin/accounts/detail/:id
export const detailAccount = async (req: Request, res: Response) => {
  try {
    const { account, roles } = await accountService.detailAccount(req.params.id)

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
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    await accountService.deleteAccount(req.params.id)
    
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
