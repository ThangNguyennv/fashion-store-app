import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/admin/role.controller'
import * as validate from '~/validations/admin/role.validation'

router.get('/', controller.index)
router.post('/create', validate.createRole, controller.createRole)
router.patch('/permissions', controller.permissionsPatch)
router.patch(
  '/edit/:id',
  validate.editRole, // middleware
  controller.editRole
)
router.delete('/delete/:id', controller.deleteRole)
router.get('/detail/:id', controller.detailRole)

export const roleRoutes: Router = router
