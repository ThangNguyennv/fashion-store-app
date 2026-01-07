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
