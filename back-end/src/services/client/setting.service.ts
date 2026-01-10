import SettingsGeneral from '~/models/settingGeneral.model'

export const getSettingGeneral = async () => {
    const settingGeneral = await SettingsGeneral.find({})
    return settingGeneral
}