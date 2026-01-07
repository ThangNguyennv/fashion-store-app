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
  validate.createBrand,
  controller.createBrand
)

router.get('/detail/:id', controller.detailBrand)

router.patch(
  '/edit/:id',
  multer().single('thumbnail'), // Nhận file logo mới nếu có
  uploadWithOneImageToCloud,
  validate.editBrand,
  controller.editBrand
)

router.delete('/delete/:id', controller.deleteBrand)

export const brandRoutes: Router = router
