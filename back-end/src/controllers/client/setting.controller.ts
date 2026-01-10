import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as settingGeneralService from '~/services/client/setting.service'

// [GET] /user/settings/general
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
