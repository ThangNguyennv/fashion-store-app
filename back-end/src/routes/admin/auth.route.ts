import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/admin/auth.controller'
import { authLimiter } from '~/middlewares/admin/rateLimit.middleware'
import * as validate from '~/validations/admin/auth.validation'

router.post('/login', authLimiter,  validate.loginPost, controller.loginPost)
router.get('/logout', controller.logout)
router.post('logout-all', controller.logoutALL)
router.post('/refresh-token', controller.refreshToken)
export const authRoutes: Router = router
