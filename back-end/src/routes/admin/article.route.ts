import { Router } from 'express'
const router: Router = Router()
// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as validate from '~/validations/admin/article.validation'
import * as controller from '~/controllers/admin/article.controller'

router.get('/', controller.index)
router.patch('/change-multi', controller.changeMulti)
router.post(
  '/create',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.createPost, // middleware
  controller.createPost
)
router.delete('/delete/:id', controller.deleteItem)
router.patch('/change-status/:status/:id', controller.changeStatus)
router.get('/detail/:id', controller.detail)
router.patch(
  '/edit/:id',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.editPatch, // middleware
  controller.editPatch
)

export const articleRoutes: Router = router
