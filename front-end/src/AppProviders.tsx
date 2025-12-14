/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { AlertProvider } from './contexts/alert/AlertContext'
import { AuthAdminProvider } from './contexts/admin/AuthContext'
import { ProductCategoryProvider } from './contexts/admin/ProductCategoryContext'
import { ProductProvider } from './contexts/admin/ProductContext'
import { ProductClientProvider } from './contexts/client/ProductContext'
import { composeProviders } from './composeProviders'
import { ArticleProvider } from './contexts/admin/ArticleContext'
import { ArticleCategoryProvider } from './contexts/admin/ArticleCategoryContext'
import { AuthClientProvider } from './contexts/client/AuthContext'
import { SettingGeneralProvider } from './contexts/client/SettingGeneralContext'
import { HomeClientProvider } from './contexts/client/HomeContext'
import { OrderProvider } from './contexts/admin/OrderContext'
import { ArticleClientProvider } from './contexts/client/ArticleContext'
import { CartProvider } from './contexts/client/CartContext'
import { OrderClientProvider } from './contexts/client/OrderContext'
import { OrderTrashProvider } from './contexts/admin/OrderTrashContext'
import { ProductCategoryTrashProvider } from './contexts/admin/ProductCategoryTrashContext'

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export function AuthAdminProviderWithKey({
  children
}: {
  children: React.ReactNode
}) {
  const [authVersion, setAuthVersion] = React.useState(0)

  // expose global trigger (hoặc context)
  ;(window as any).bumpAuth = () =>
    setAuthVersion(v => v + 1)

  return (
    <AuthAdminProvider key={authVersion}>
      {children}
    </AuthAdminProvider>
  )
}

// Gom tất cả provider thành 1 (Nhớ viết từ trên xuống để khi chạy nó sẽ chạy từ children -> từ dưới lên trên)
export const AppProviders = composeProviders(
  ThemeProviderWrapper,
  AlertProvider,
  AuthAdminProviderWithKey,
  AuthClientProvider,
  HomeClientProvider,
  SettingGeneralProvider,
  ProductCategoryProvider,
  ProductCategoryTrashProvider,
  ProductProvider,
  OrderProvider,
  OrderTrashProvider,
  OrderClientProvider,
  CartProvider,
  ArticleClientProvider,
  ProductClientProvider,
  ArticleProvider,
  ArticleCategoryProvider
)
