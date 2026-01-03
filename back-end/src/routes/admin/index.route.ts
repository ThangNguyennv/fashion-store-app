import { Express } from 'express'
import systemConfig from '~/config/system'
import * as authMiddleware from '~/middlewares/admin/auth.middleware'
import { statisticRoutes } from './statistic.route'
import { productRoutes } from './product.route'
import { productCategoryRoutes } from './product-category.route'
import { roleRoutes } from './role.route'
import { accountRoutes } from './account.route'
import { userRoutes } from './user.route'
import { authRoutes } from './auth.route'
import { myAccountRoutes } from './my-account.route'
import { articleRoutes } from './article.route'
import { articleCategoryRoutes } from './article-category.route'
import { orderRoutes } from './order.route'
import { settingRoutes } from './setting.route'
import { brandRoutes } from './brand.route'
import { chatAdminRoutes } from './chat.admin.route'
import { noCache } from '~/middlewares/admin/noCache.middleware'
import { requirePermission } from '~/middlewares/admin/role.middleware'

const routeAdmin = (app: Express): void => {
  const PATH_ADMIN = systemConfig.prefixAdmin
  app.use(PATH_ADMIN, noCache)
  app.use(PATH_ADMIN + '/auth', authRoutes)
  app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, myAccountRoutes)
  app.use(PATH_ADMIN + '/statistics', authMiddleware.requireAuth,requirePermission(['Admin']), statisticRoutes)
  app.use(PATH_ADMIN + '/settings', authMiddleware.requireAuth,requirePermission(['Admin']), settingRoutes)
  app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth,requirePermission(['Admin']), roleRoutes)
  app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth,requirePermission(['Admin']), accountRoutes)
  app.use(PATH_ADMIN + '/users', authMiddleware.requireAuth,requirePermission(['Admin']), userRoutes)

  app.use(PATH_ADMIN + '/chats', authMiddleware.requireAuth,requirePermission(['Admin', 'Product']), chatAdminRoutes)
  app.use(PATH_ADMIN + '/products-category', authMiddleware.requireAuth,requirePermission(['Admin', 'Product']), productCategoryRoutes)
  app.use(PATH_ADMIN + '/products', authMiddleware.requireAuth, requirePermission(['Admin', 'Product']), productRoutes)

  app.use(PATH_ADMIN + '/brands', authMiddleware.requireAuth,requirePermission(['Admin', 'Content']), brandRoutes)
  app.use(PATH_ADMIN + '/articles', authMiddleware.requireAuth,requirePermission(['Admin', 'Content']), articleRoutes)
  app.use(PATH_ADMIN + '/articles-category', authMiddleware.requireAuth,requirePermission(['Admin', 'Content']), articleCategoryRoutes)

  app.use(PATH_ADMIN + '/orders', authMiddleware.requireAuth,requirePermission(['Admin', 'Order']), orderRoutes)
}

export default routeAdmin
