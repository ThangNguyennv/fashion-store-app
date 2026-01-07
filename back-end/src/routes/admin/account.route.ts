import { Router } from 'express'
const router: Router = Router()

import * as controller from '~/controllers/admin/account.controller'
// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as validate from '~/validations/admin/account.validation'

router.get('/', controller.index)
router.post(
  '/create',
  multer().single('avatar'),
  uploadWithOneImageToCloud,
  validate.createAccount, // middleware
  controller.createAccount
)
router.patch('/change-status/:status/:id', controller.changeStatusAccount)
// Bắt đầu chỉnh sửa sản phẩm và gửi form đi.
router.patch(
  '/edit/:id',
  multer().single('avatar'),
  uploadWithOneImageToCloud,
  validate.editAccount, // middleware
  controller.editAccount
)
router.get('/detail/:id', controller.detailAccount)
router.delete('/delete/:id', controller.deleteAccount)

export const accountRoutes: Router = router
