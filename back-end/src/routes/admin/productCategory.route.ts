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
  validate.createProductCategory, // middleware
  controller.createProductCategory
)
router.delete('/delete/:id', controller.deleteProductCategory)
router.patch(
  '/edit/:id',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.editProductCategory, // middleware
  controller.editProductCategory
)
router.get('/detail/:id', controller.detailProductCategory)
router.patch('/change-status-with-children/:status/:id', controller.changeStatusWithChildren)

router.get('/trash', controller.productCategoryTrash)
router.patch('/trash/form-change-multi-trash', controller.changeMultiTrash)
router.delete('/trash/permanentlyDelete/:id', controller.permanentlyDeleteProductCategory)
router.patch('/trash/recover/:id', controller.recoverProductCategory)

export const productCategoryRoutes: Router = router
