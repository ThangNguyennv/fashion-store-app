import { Router } from 'express'
const router: Router = Router()
// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as validate from '~/validations/admin/myAccount.validation'
import * as controller from '~/controllers/admin/myAccount.controller'

router.get('/', controller.index) // detail
router.patch(
  '/edit',
  multer().single('avatar'),
  uploadWithOneImageToCloud,
  validate.editPatch, // middleware
  controller.editPatch
)

export const myAccountRoutes: Router = router
