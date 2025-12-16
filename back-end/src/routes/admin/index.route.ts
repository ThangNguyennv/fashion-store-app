import { Express } from 'express'
import systemConfig from '~/config/system'
import * as authMiddleware from '~/middlewares/admin/auth.middleware'
import { dashboardRoutes } from './dashboard.route'
import { productRoutes } from './product.route'
import { trashRoutes } from './trash.route'
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
import { Request, Response, NextFunction } from 'express'

const routeAdmin = (app: Express): void => {
  const PATH_ADMIN = systemConfig.prefixAdmin
  app.use(PATH_ADMIN, noCache)
  app.use(PATH_ADMIN + '/auth', authRoutes)
  app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, myAccountRoutes)
  app.use(PATH_ADMIN + '/dashboard', authMiddleware.requireAuth, dashboardRoutes)
  app.use(PATH_ADMIN + '/orders', authMiddleware.requireAuth, orderRoutes)
  app.use(PATH_ADMIN + '/chats', authMiddleware.requireAuth, chatAdminRoutes)
  app.use(PATH_ADMIN + '/settings', authMiddleware.requireAuth, settingRoutes)

  app.use(PATH_ADMIN + '/products', authMiddleware.requireAuth, productRoutes)
  app.use(PATH_ADMIN + '/products-category', authMiddleware.requireAuth, productCategoryRoutes)
  app.use(PATH_ADMIN + '/brands', authMiddleware.requireAuth, brandRoutes)
  app.use(PATH_ADMIN + '/articles', authMiddleware.requireAuth, articleRoutes)
  app.use(PATH_ADMIN + '/articles-category', authMiddleware.requireAuth, articleCategoryRoutes)
  app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, roleRoutes)
  app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, accountRoutes)
  app.use(PATH_ADMIN + '/users', authMiddleware.requireAuth, userRoutes)
  app.use(PATH_ADMIN + '/trash', authMiddleware.requireAuth, trashRoutes)
}

export default routeAdmin
