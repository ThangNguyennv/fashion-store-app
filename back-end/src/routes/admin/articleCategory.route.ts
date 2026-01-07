import { Router } from 'express'
const router: Router = Router()

import * as controller from '~/controllers/admin/articleCategory.controller'
// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as validate from '~/validations/admin/articleCategory.validation'

router.get('/', controller.index)
// router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi', controller.changeMulti)
router.post(
  '/create',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.createArticleCategory, // middleware
  controller.createArticleCategory
)
router.delete('/delete/:id', controller.deleteArticleCategory)
router.patch(
  '/edit/:id',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.editArticleCategory, // middleware
  controller.editArticleCategory
)
router.get('/detail/:id', controller.detailArticleCategory)
router.patch('/change-status-with-children/:status/:id', controller.changeStatusWithChildren)

export const articleCategoryRoutes: Router = router
