import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/admin/role.controller'
import * as validate from '~/validates/admin/role.validate'

router.get('/', controller.index)
router.post('/create', validate.createPost, controller.createPost)
router.patch('/permissions', controller.permissionsPatch)
router.patch(
  '/edit/:id',
  validate.editPost, // middleware
  controller.editPatch
)
router.delete('/delete/:id', controller.deleteItem)
router.get('/detail/:id', controller.detail)

export const roleRoutes: Router = router
