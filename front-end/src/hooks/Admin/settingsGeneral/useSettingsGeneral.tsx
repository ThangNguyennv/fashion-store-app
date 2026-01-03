import { useEffect, useState } from 'react'
import { fetchSettingGeneralAPI } from '~/apis/admin/settingGeneral.api'
import { useAuth } from '~/contexts/admin/AuthContext'

import type { SettingGeneralAPIResponse, SettingGeneralInfoInterface } from '~/types/setting.type'

const useSettingsGeneral = () => {
  const [general, setGeneral] = useState<SettingGeneralInfoInterface | null>(null)
  const { role } = useAuth()

  useEffect(() => {
    fetchSettingGeneralAPI().then((data: SettingGeneralAPIResponse) => {
      setGeneral(data.settingGeneral[0])
    })
  }, [])
  return {
    general,
    role
  }
}

export default useSettingsGeneral