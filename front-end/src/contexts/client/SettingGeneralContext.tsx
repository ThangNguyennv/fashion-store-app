/* eslint-disable no-console */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { SettingGeneralAPIResponse } from '~/types/setting.type'
import { fetchSettingGeneralAPI } from '~/apis/client/settingGeneral.api'
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress'

interface SettingGeneralContextType {
  settingGeneral: SettingGeneralAPIResponse['settingGeneral'] | null
  setSettingGeneral: (settingGeneral: SettingGeneralAPIResponse['settingGeneral'] | null) => void
}

const SettingContext = createContext<SettingGeneralContextType | undefined>(undefined)

export const SettingGeneralClientProvider = ({ children }: { children: ReactNode }) => {
  const [settingGeneral, setSettingGeneral] = useState<SettingGeneralContextType['settingGeneral']>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initSettings = async () => {
      try {
        const response = await fetchSettingGeneralAPI()
        if (response.settingGeneral) {
          setSettingGeneral(response.settingGeneral)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      } finally {
        setIsLoading(false) // Tắt loading dù thành công hay thất bại
      }
    }
    initSettings()
  }, [])
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen"
      >
        <CircularProgress />
      </motion.div>
    )
  }
  return (
    <SettingContext.Provider value={{ settingGeneral, setSettingGeneral }}>
      {children}
    </SettingContext.Provider>
  )
}

export const useSettingGeneral = () => {
  const context = useContext(SettingContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}