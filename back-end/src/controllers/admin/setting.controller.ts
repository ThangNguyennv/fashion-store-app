import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as settingGeneralService from '~/services/admin/setting.service'

// [GET] /admin/settings/general
export const index = async (req: Request, res: Response) => {
  try {
    const settingGeneral = await settingGeneralService.getSettingGeneral()

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      settingGeneral: settingGeneral
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/settings/general/edit
export const editSettingGeneral = async (req: Request, res: Response) => {
  try {
    const settingsGeneral = await settingGeneralService.editSettingGeneral(req.body)
    
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công cài đặt chung!',
      data: settingsGeneral
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
