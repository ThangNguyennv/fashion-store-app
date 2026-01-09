import { Request, Response } from 'express'
import * as settingGeneralService from '~/services/admin/setting.service'

// [GET] /admin/settings/general
export const index = async (req: Request, res: Response) => {
  try {
    const settingGeneral = await settingGeneralService.getSettingGeneral()

    res.json({
      code: 200,
      message: 'Thành công!',
      settingGeneral: settingGeneral
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/settings/general/edit
export const editSettingGeneral = async (req: Request, res: Response) => {
  try {
    const settingsGeneral = await settingGeneralService.editSettingGeneral(req.body)
    
    res.json({
      code: 200,
      message: 'Cập nhật thành công cài đặt chung!',
      data: req.body
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
