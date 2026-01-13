/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSuccessAPI } from '~/apis/client/checkout.api'
import type { OrderDetailInterface, OrderInfoInterface } from '~/interfaces/order.interface'

const useSuccess = () => {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<OrderInfoInterface | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    setLoading(true)
    const fetchData = async () => {
      try {
        const res: OrderDetailInterface = await fetchSuccessAPI(orderId)
        setOrder(res.order)
      } catch (error) {
        console.error('Lỗi khi fetch đơn hàng:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [orderId])
  return {
    order,
    loading
  }
}

export default useSuccess