import { Router } from 'express'
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
import * as controller from '~/controllers/admin/brand.controller'
import * as validate from '~/validations/admin/brand.validation'

const router: Router = Router()

router.get('/', controller.index)

router.post(
  '/create',
  multer().single('thumbnail'), // Nhận file logo với field 'thumbnail'
  uploadWithOneImageToCloud,
  validate.createPost,
  controller.createPost
)

router.get('/detail/:id', controller.detail)

router.patch(
  '/edit/:id',
  multer().single('thumbnail'), // Nhận file logo mới nếu có
  uploadWithOneImageToCloud,
  validate.createPost,
  controller.editPatch
)

router.delete('/delete/:id', controller.deleteItem)

export const brandRoutes: Router = router
