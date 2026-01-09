import { Request, Response } from 'express'
import * as userService from '~/services/admin/user.service'

// [GET] /admin/users
export const index = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers()

    res.json({
      code: 200,
      message: 'Thành công!',
      users: users
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/users/change-status/:status/:id
export const changeStatusUser = async (req: Request, res: Response) => {
  try {
    await userService.changeStatusUser(req.params.status, req.params.id)

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

// [PATCH] /admin/users/edit/:id
export const editUser = async (req: Request, res: Response) => {
  try {
    await userService.editUser(req.body, req.params.id)

    res.json({
      code: 200,
      message: 'Cập nhật thành công người dùng!'
    })
  } catch (error) {
    res.json({
      code: error.statusCode || 400,
      message: error.message || 'Lỗi',
      error: error
    })
  }
}

// [GET] /admin/users/detail/:id
export const detailUser = async (req: Request, res: Response) => {
  try {
    const accountUser = await userService.detailUser(req.params.id)

    res.json({
      code: 200,
      message: 'Chi tiết người dùng!',
      accountUser: accountUser
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [DELETE] /admin/users/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id)

    res.json({
      code: 204,
      message: 'Xóa thành công người dùng!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
