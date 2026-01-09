import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/client/cart.controller'

router.get('/', controller.index)
router.patch('/change-multi', controller.changeMulti)
router.post('/add/:productId', controller.addToCart)
// router.delete('/delete/:productId', controller.deleteCart)
// router.patch('/update/:productId/:quantity', controller.update)
router.patch('/update-quantity', controller.updateQuantity) // Route mới cho số lượng
router.delete('/delete-item', controller.deleteInCart) // Route mới để xóa
router.patch('/update-variant', controller.updateVariant)
export const cartRoutes: Router = router
