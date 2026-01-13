import { SettingInterface } from '~/interfaces/admin/setting.interface'
import SettingsGeneral from '~/models/settingGeneral.model'

export const getSettingGeneral = async () => {
  const settingGeneral = await SettingsGeneral.find({})
  return settingGeneral
}

export const editSettingGeneral = async (data: SettingInterface) => {
  const dataTemp = {
    websiteName: data.websiteName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    copyright: data.copyright,
    logo: data.logo
  }
  const settingsGeneral = await SettingsGeneral.findOne({}) // Lấy một document bất kỳ trong collection (thường là document đầu tiên)
  if (settingsGeneral) {
    await SettingsGeneral.findByIdAndUpdate(
      { _id: settingsGeneral._id }, 
      { $set: dataTemp }, 
      { new: true } // trả về document mới
    )
  } else {
    const settingGeneral = new SettingsGeneral(dataTemp)
    await settingGeneral.save()
  } 
  return settingsGeneral
}