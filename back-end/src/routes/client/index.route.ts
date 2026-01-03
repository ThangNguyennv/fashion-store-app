import { Express } from 'express'
import { homeRoutes } from './home.route'
import { productRoutes } from './product.route'
import * as categoryMiddleware from '~/middlewares/client/category.middleware'
import * as settingMiddleware from '~/middlewares/client/setting.middleware'
// import * as authMiddleware from '~/middlewares/client/auth.middleware'
import * as cartMiddleware from '~/middlewares/client/cart.middleware'

import { articleRoutes } from './article.route'
import { searchRoutes } from './search.route'
import { cartRoutes } from './cart.route'
import { checkoutRoutes } from './checkout.route'
import { userRoutes } from './user.route'
import { settingRoutes } from './setting.route'
import { brandClientRoutes } from './brand.route'
import { chatRoutes } from "./chat.route"
import passport from 'passport'
import '~/config/passport'
import { noCache } from '~/middlewares/admin/noCache.middleware'

const routeClient = (app: Express): void => {
  // Middleware để lấy danh mục sản phẩm và bài viết
  app.use(categoryMiddleware.categoryProduct)
  app.use(categoryMiddleware.categoryArticle)
  app.use(settingMiddleware.settingsGeneral)
  app.use(passport.initialize())

  // --- NHÓM 1: CHO PHÉP CACHE (Public) ---
  // Không thêm noCache vào đây để tăng tốc độ tải trang
  app.use('/', homeRoutes)
  app.use('/products', productRoutes)
  app.use('/articles', articleRoutes)
  app.use('/brands', brandClientRoutes)
  app.use('/search', searchRoutes)

  // --- NHÓM 2: KHÔNG CACHE (Private/Dynamic) ---
  app.use('/cart', noCache, cartMiddleware.cartId, cartRoutes)
  app.use('/checkout', noCache, cartMiddleware.cartId, checkoutRoutes)
  app.use('/user', noCache, userRoutes)
  app.use('/settings', noCache, settingRoutes)
  app.use("/chats", noCache, chatRoutes)
}

// app.use() -> Đi vào router con thì có thể là các phương thức khác
// app.get() -> Nhược điểm: Cố định router cha là get() thì các router con cũng là get() -> không linh hoạt
export default routeClient
