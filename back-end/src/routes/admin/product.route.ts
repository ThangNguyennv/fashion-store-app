import { Router } from 'express'
const router: Router = Router()
// Upload ảnh
import multer from 'multer'
import uploadCloud from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as controller from '~/controllers/admin/product.controller'
import * as validate from '~/validates/admin/product.validate'
import { parseProductData } from '~/middlewares/admin/parseProductData.middleware'; 
import { requirePermission } from '~/middlewares/admin/role.middleware'

router.get('/', requirePermission("products_view"), controller.index)
router.patch('/change-multi', requirePermission("products_edit"), controller.changeMulti)
router.post(
  '/create',
  requirePermission("products_create"),
  multer().array('files', 15), // Nhận tối đa 15 files với tên trường là 'files'
  uploadCloud,
  parseProductData,
  validate.createPost, // middleware
  controller.createPost
)
router.patch('/change-status/:status/:id', requirePermission("products_edit"), controller.changeStatus)
router.delete('/delete/:id', requirePermission("products_delete"), controller.deleteItem)
router.patch(
  '/edit/:id',
  requirePermission("products_edit"),
  multer().array('files', 15), // Nhận tối đa 15 files với tên trường là 'files'
  uploadCloud,
  parseProductData,
  validate.createPost, // middleware
  controller.editPatch
)
router.get('/detail/:id', requirePermission("products_view"), controller.detail)

router.get('/trash', controller.productTrash)
router.patch('/trash/form-change-multi-trash', controller.changeMultiTrash)
router.delete('/trash/permanentlyDelete/:id', controller.permanentlyDeleteProduct)
router.patch('/trash/recover/:id', controller.recoverProduct)

export const productRoutes: Router = router
