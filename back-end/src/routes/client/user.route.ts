import { Router } from 'express'
const router: Router = Router()
import passport from 'passport'

// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/client/uploadCloud.middleware'
// Hết Upload ảnh
import * as controller from '~/controllers/client/user.controller'
import * as validate from '~/validates/client/user.validate'
import * as authMiddleware from '~/middlewares/client/auth.middleware'
import { setAuthCookies } from '~/controllers/client/user.controller'

router.post('/register', validate.registerPost, controller.registerPost)
router.post('/login', validate.loginPost, controller.loginPost)
router.get('/logout', controller.logout)
router.post('/refresh-token', controller.refreshToken)

router.post(
  '/password/forgot',
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
)
// router.post(
//   '/password/otp', 
//   validate.otpPasswordPost,
//   controller.otpPasswordPost)
router.post(
  '/password/reset',
  validate.resetPasswordPost,
  controller.resetPasswordPost
)

router.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] // Yêu cầu Google trả về profile và email
  })
)

router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/user/login?error=auth_failed`, // Nếu thất bại, đá về trang đăng nhập
    session: false // Không dùng session, dùng JWT
  }),
  controller.googleCallback // Nếu thành công, gọi hàm controller này để cấp JWT
)

router.post('/set-auth-cookies', setAuthCookies)

// route private
router.get(
  '/account/info', 
  authMiddleware.requireAuth, 
  controller.info)
router.patch(
  '/account/info/edit',
  authMiddleware.requireAuth,
  multer().single('avatar'),
  uploadWithOneImageToCloud,
  validate.editPatch,
  controller.editPatch
)
router.patch(
  '/account/info/change-password',
  authMiddleware.requireAuth,
  validate.changePasswordPatch,
  controller.changePasswordPatch
)

router.get('/my-orders', authMiddleware.requireAuth, controller.getOrders)
router.patch('/my-orders/cancel-order/:id', authMiddleware.requireAuth, controller.cancelOrder)
export const userRoutes: Router = router
