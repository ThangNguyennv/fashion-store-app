import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as myAccountService from '~/services/admin/myAccount.service'

// [GET] /admin/my-account
export const index = async (req: Request, res: Response) => {
  try {
    const { myAccount, role } = await myAccountService.getMyAccount(req['accountAdmin']._id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      myAccount: myAccount,
      role: role
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/my-account/edit
export const editMyAccount = async (req: Request, res: Response) => {
  try {
    const result = await myAccountService.editMyAccount( req.body, req['accountAdmin'].id)
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
