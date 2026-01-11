import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailOrderAPI, fetchEditEstimatedConfirmedDay, fetchEditEstimatedDeliveryDay } from '~/apis/admin/order.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { OrderDetailInterface, OrderInfoInterface } from '~/types/order.type'

export const useDetail = () => {
  const [orderDetail, setOrderDetail] = useState<OrderInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { role } = useAuth()
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    if (!id) return
    fetchDetailOrderAPI(id)
      .then((response: OrderDetailInterface) => {
        setOrderDetail(response.order)
      })
  }, [id])

  const handleSubmitDeliveryDay = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!orderDetail || !id) return
    const estimatedDeliveryDay = e.currentTarget.estimatedDeliveryDay.value

    if (!estimatedDeliveryDay) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn ngày giao hàng', severity: 'error' } })
      return
    }
    const response = await fetchEditEstimatedDeliveryDay({ estimatedDeliveryDay, id })
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      // 4. Cập nhật state để UI thay đổi ngay lập tức
      setOrderDetail({ ...orderDetail, estimatedDeliveryDay: estimatedDeliveryDay })
    }
  }

  const handleSubmitConfirmedDay = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!orderDetail || !id) return
    const estimatedConfirmedDay = e.currentTarget.estimatedConfirmedDay.value

    if (!estimatedConfirmedDay) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn ngày nhận hàng', severity: 'error' } })
      return
    }

    const response = await fetchEditEstimatedConfirmedDay({ estimatedConfirmedDay, id })
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOrderDetail({ ...orderDetail, estimatedConfirmedDay: estimatedConfirmedDay })
    }
  }


  return {
    orderDetail,
    id,
    role,
    handleSubmitConfirmedDay,
    handleSubmitDeliveryDay
  }
}