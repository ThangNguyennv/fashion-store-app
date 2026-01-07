import { Request, Response } from 'express'
import SettingsGeneral from '~/models/settingGeneral.model'

// [GET] /admin/settings/general
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

// [PATCH] /admin/settings/general/edit
export const generalPatch = async (req: Request, res: Response) => {
  try {
    const settingsGeneral = await SettingsGeneral.findOne({}) // Lấy một document bất kỳ trong collection (thường là document đầu tiên)
    if (settingsGeneral) {
      await SettingsGeneral.findByIdAndUpdate(
        { _id: settingsGeneral._id }, 
        req.body, 
        { new: true }) // trả về document mới
    } else {
      const settingGeneral = new SettingsGeneral(req.body)
      await settingGeneral.save()
    } 
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
