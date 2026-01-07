import { Router } from 'express'
const router: Router = Router()
// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as controller from '~/controllers/admin/productCategory.controller'
import * as validate from '~/validations/admin/productCategory.validation'

router.get('/',  controller.index)
// router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi',  controller.changeMulti)
router.post(
  '/create',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.createPost, // middleware
  controller.createPost
)
router.delete('/delete/:id', controller.deleteItem)
router.patch(
  '/edit/:id',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.editPatch, // middleware
  controller.editPatch
)
router.get('/detail/:id', controller.detail)
router.patch('/change-status-with-children/:status/:id', controller.changeStatusWithChildren)

router.get('/trash', controller.ProductCategoryTrash)
router.patch('/trash/form-change-multi-trash', controller.changeMultiTrash)
router.delete('/trash/permanentlyDelete/:id', controller.permanentlyDeleteProductCategory)
router.patch('/trash/recover/:id', controller.recoverProductCategory)

export const productCategoryRoutes: Router = router
