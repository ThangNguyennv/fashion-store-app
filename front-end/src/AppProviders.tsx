import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { AlertProvider } from './contexts/alert/AlertContext'
import { AuthAdminProvider } from './contexts/admin/AuthContext'
import { ProductCategoryAdminProvider } from './contexts/admin/ProductCategoryContext'
import { ProductAdminProvider } from './contexts/admin/ProductContext'
import { ProductClientProvider } from './contexts/client/ProductContext'
import { composeProviders } from './composeProviders'
import { ArticleAdminProvider } from './contexts/admin/ArticleContext'
import { ArticleCategoryAdminProvider } from './contexts/admin/ArticleCategoryContext'
import { AuthClientProvider } from './contexts/client/AuthContext'
import { SettingGeneralClientProvider } from './contexts/client/SettingGeneralContext'
import { HomeClientProvider } from './contexts/client/HomeContext'
import { OrderAdminProvider } from './contexts/admin/OrderContext'
import { ArticleClientProvider } from './contexts/client/ArticleContext'
import { CartClientProvider } from './contexts/client/CartContext'
import { OrderClientProvider } from './contexts/client/OrderContext'
import { OrderTrashAdminProvider } from './contexts/admin/OrderTrashContext'
import { ProductCategoryTrashAdminProvider } from './contexts/admin/ProductCategoryTrashContext'
import { ProductTrashAdminProvider } from './contexts/admin/ProductTrashContext'

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

// export function AuthAdminProviderWithKey({
//   children
// }: {
//   children: React.ReactNode
// }) {
//   const [authVersion, setAuthVersion] = React.useState(0)

//   // expose global trigger (hoặc context)
//   ;(window as any).bumpAdminAuth = () =>
//     setAuthVersion(v => v + 1)

//   return (
//     <AuthAdminProvider key={authVersion}>
//       {children}
//     </AuthAdminProvider>
//   )
// }

// export function AuthClientProviderWithKey({
//   children
// }: {
//   children: React.ReactNode
// }) {
//   const [authVersion, setAuthVersion] = React.useState(0)

//   // expose global trigger (hoặc context)
//   ;(window as any).bumpClientAuth = () =>
//     setAuthVersion(v => v + 1)

//   return (
//     <AuthClientProvider key={authVersion}>
//       {children}
//     </AuthClientProvider>
//   )
// }
// // Gom tất cả provider thành 1 (Nhớ viết từ trên xuống để khi chạy nó sẽ chạy từ children -> từ dưới lên trên)
// export const AppProviders = composeProviders(
//   ThemeProviderWrapper,
//   AlertProvider,
//   AuthAdminProviderWithKey,
//   AuthClientProviderWithKey,
//   HomeClientProvider,
//   SettingGeneralProvider,
//   ProductCategoryProvider,
//   ProductCategoryTrashProvider,
//   ProductProvider,
//   ProductTrashProvider,
//   OrderProvider,
//   OrderTrashProvider,
//   OrderClientProvider,
//   CartProvider,
//   ArticleClientProvider,
//   ProductClientProvider,
//   ArticleProvider,
//   ArticleCategoryProvider
// )

// 1. Nhóm Global: Các Provider dùng chung cho cả app (Theme, Alert)
export const GlobalProviders = composeProviders(
  ThemeProviderWrapper,
  AlertProvider
)

// 2. Nhóm Client: Chỉ bọc các trang người dùng
export const ClientProviders = composeProviders(
  AuthClientProvider,
  HomeClientProvider,
  SettingGeneralClientProvider,
  CartClientProvider,
  OrderClientProvider,
  ProductClientProvider,
  ArticleClientProvider
)

// 3. Nhóm Admin: Chỉ bọc các trang quản trị
export const AdminProviders = composeProviders(
  AuthAdminProvider,
  ProductCategoryAdminProvider,
  ProductCategoryTrashAdminProvider,
  ProductAdminProvider,
  ProductTrashAdminProvider,
  OrderAdminProvider,
  OrderTrashAdminProvider,
  ArticleAdminProvider,
  ArticleCategoryAdminProvider
)
