import { Router } from 'express'
import * as controller from '~/controllers/client/chat.controller'
import * as authMiddleware from '~/middlewares/client/auth.middleware'

const router: Router = Router()

router.get(
  '/',
  authMiddleware.requireAuth,
  controller.getChat
)

export const chatRoutes: Router = router
