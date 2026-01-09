import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/admin/user.controller'
// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as validate from '~/validations/admin/user.validation'

router.get('/', controller.index)
router.patch('/change-status/:status/:id', controller.changeStatusUser)
router.patch(
  '/edit/:id',
  multer().single('avatar'),
  uploadWithOneImageToCloud,
  validate.editUser, // middleware
  controller.editUser
)
router.get('/detail/:id', controller.detailUser)
router.delete('/delete/:id', controller.deleteUser)

export const userRoutes: Router = router
