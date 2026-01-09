import { Router } from 'express'
const router: Router = Router()
import multer from 'multer'
import * as controller from '~/controllers/admin/setting.controller'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
import * as validate from '~/validations/admin/settingGeneral.validation'

router.get('/general', controller.index)
router.patch(
  '/general/edit',
  multer().single('logo'),
  uploadWithOneImageToCloud,
  validate.editSettingGeneral, // middleware
  controller.editSettingGeneral
)

export const settingRoutes: Router = router
