import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as accountService from '~/services/admin/account.service'

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  try {
    const { accounts, roles } = await accountService.getAccountsWithRoles()
  
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      accounts: accounts,
      roles: roles
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/accounts/create
export const createAccount = async (req: Request, res: Response) => {
  try {
    const result = await accountService.createAccount(req.body)
    if (!result.success) {
      res.status(StatusCodes.CONFLICT).json({
        code: result.code,
        message: result.message
      })
      return
    }
    const { newAccount } = result
    
    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Thêm tài khoản thành công!',
      data: newAccount,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeStatusAccount = async (req: Request, res: Response) => {
  try {
    await accountService.changeStatusAccount(req.params.status, req.params.id)
    
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật trạng thái thành công!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/accounts/edit/:id
export const editAccount = async (req: Request, res: Response) => {
  try {
    const result = await accountService.editAccount(req.body, req.params.id)
    if (!result.success) {
      res.status(StatusCodes.CONFLICT).json({
        code: result.code,
        message: result.message
      })
      return
    }
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công tài khoản!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/accounts/detail/:id
export const detailAccount = async (req: Request, res: Response) => {
  try {
    const { account, roles } = await accountService.detailAccount(req.params.id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      account: account,
      roles: roles
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/accounts/delete/:id
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    await accountService.deleteAccount(req.params.id)
    
    res.status(StatusCodes.NO_CONTENT).json({
      code: 204,
      message: 'Xóa thành công tài khoản!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
