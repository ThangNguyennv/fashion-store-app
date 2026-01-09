import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/admin/order.controller'

router.get('/', controller.index)
router.patch('/change-multi', controller.changeMulti)
router.patch('/edit-estimatedDeliveryDay', controller.estimatedDeliveryDay)
router.patch('/edit-estimatedConfirmedDay', controller.estimatedConfirmedDay)
router.get('/export', controller.exportOrder)
router.patch('/change-status/:status/:id', controller.changeStatusOrder)
router.delete('/delete/:id', controller.deleteOrder)
router.get('/detail/:id', controller.detailOrder)
router.get('/trash', controller.orderTrash)
router.patch('/trash/form-change-multi-trash', controller.changeMultiTrash)
router.delete('/trash/permanentlyDelete/:id', controller.permanentlyDeleteOrder)
router.patch('/trash/recover/:id', controller.recoverOrder)

export const orderRoutes: Router = router
