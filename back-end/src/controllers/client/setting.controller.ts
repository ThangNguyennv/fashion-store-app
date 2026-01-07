import { Request, Response } from 'express'
import SettingsGeneral from '~/models/settingGeneral.model'

// [GET] /user/settings/general
export const index = async (req: Request, res: Response) => {
  try {
    const settingGeneral = await SettingsGeneral.find({})
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
