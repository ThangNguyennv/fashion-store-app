export interface SettingGeneralInfoInterface {
    websiteName: string,
    logo: string,
    phone: string,
    email: string,
    address: string,
    copyright: string
}

export interface SettingGeneralAPIResponse {
  settingGeneral: SettingGeneralInfoInterface[]
}