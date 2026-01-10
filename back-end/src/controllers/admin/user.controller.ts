import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as userService from '~/services/admin/user.service'

// [GET] /admin/users
export const index = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers()

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      users: users
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/users/change-status/:status/:id
export const changeStatusUser = async (req: Request, res: Response) => {
  try {
    await userService.changeStatusUser(req.params.status, req.params.id)

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

// [PATCH] /admin/users/edit/:id
export const editUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.editUser(req.body, req.params.id)
    if (!result.success) {
      res.status(StatusCodes.CONFLICT).json({
        code: result.code,
        message: result.message
      })
      return
    }
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công người dùng!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/users/detail/:id
export const detailUser = async (req: Request, res: Response) => {
  try {
    const accountUser = await userService.detailUser(req.params.id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Chi tiết người dùng!',
      accountUser: accountUser
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/users/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id)

    res.status(StatusCodes.NO_CONTENT).json({
      code: 204,
      message: 'Xóa thành công người dùng!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
