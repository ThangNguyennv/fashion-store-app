import mongoose from 'mongoose'

const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String
  },
  {
    timestamps: true
  }
)

const SettingsGeneral = mongoose.model(
  'SettingsGeneral',
  settingGeneralSchema,
  'settings-general'
)

export default SettingsGeneral
