import SettingsGeneral from '~/models/settingGeneral.model'

export const getSettingGeneral = async () => {
    const settingGeneral = await SettingsGeneral.find({})
    return settingGeneral
}

export const editSettingGeneral = async (data: any) => {
    const settingsGeneral = await SettingsGeneral.findOne({}) // Lấy một document bất kỳ trong collection (thường là document đầu tiên)
    if (settingsGeneral) {
      await SettingsGeneral.findByIdAndUpdate(
        { _id: settingsGeneral._id }, 
        data, 
        { new: true }) // trả về document mới
    } else {
      const settingGeneral = new SettingsGeneral(data)
      await settingGeneral.save()
    } 
    return settingsGeneral
}