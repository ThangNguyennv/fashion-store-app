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

const routeClient = (app: Express): void => {
  // Middleware để lấy danh mục sản phẩm và bài viết
  app.use(categoryMiddleware.categoryProduct)
  app.use(categoryMiddleware.categoryArticle)
  app.use(settingMiddleware.settingsGeneral)

  app.use(passport.initialize())
  app.use('/', homeRoutes)
  app.use('/products', productRoutes)
  app.use('/articles', articleRoutes)
  app.use('/brands', brandClientRoutes)
  app.use('/search', searchRoutes)
  app.use('/cart', cartMiddleware.cartId, cartRoutes)
  app.use('/checkout', cartMiddleware.cartId, checkoutRoutes)
  app.use('/user', userRoutes)
  app.use('/settings', settingRoutes)
  app.use("/chats", chatRoutes)
}

// app.use() -> Đi vào router con thì có thể là các phương thức khác
// app.get() -> Nhược điểm: Cố định router cha là get() thì các router con cũng là get() -> không linh hoạt
export default routeClient
