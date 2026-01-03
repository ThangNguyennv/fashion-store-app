/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { HomeAPIReponse } from '~/types/home.type'

interface HomeContextType {
  dataHome: HomeAPIReponse
  setDataHome: (dataHome: HomeAPIReponse | null) => void
}

const HomeContext = createContext<HomeContextType | undefined>(undefined)

export const HomeClientProvider = ({ children }: { children: ReactNode }) => {
  const [dataHome, setDataHomeState] = useState<HomeAPIReponse>({} as HomeAPIReponse)

  const setDataHome = (dataHome: HomeAPIReponse | null) => {
    setDataHomeState(dataHome ?? ({} as HomeAPIReponse))
  }

  return (
    <HomeContext.Provider value={{ dataHome, setDataHome }}>
      {children}
    </HomeContext.Provider>
  )
}

export const useHome = () => {
  const context = useContext(HomeContext)
  if (!context) throw new Error('useHome must be used inside HomeProvider')
  return context
}