/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { fetchCartAPI } from '~/apis/client/cart.api'
import type { CartInfoInterface } from '~/types/cart.type'
import { fetchOrderAPI } from '~/apis/client/checkout.api'
import { useCart } from '~/contexts/client/CartContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/contexts/client/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { checkoutSchema, type CheckoutFormData } from '~/validations/client/checkout.validate'

const useCheckout = () => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { refreshCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const navigate = useNavigate()
  const { accountUser } = useAuth()
  const { dispatchAlert } = useAlertContext()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      note: '',
      paymentMethod: 'COD'
    }
  })
  useEffect(() => {
    setValue('paymentMethod', paymentMethod as any)
  }, [paymentMethod, setValue])

  // Tự động điền thông tin khi accountUser thay đổi
  useEffect(() => {
    if (accountUser) {
      reset({
        fullName: accountUser.fullName || '',
        phone: accountUser.phone || '',
        address: accountUser.address || '',
        paymentMethod: paymentMethod as any
      })
    }
  }, [accountUser, reset])

  // Lấy dữ liệu giỏ hàng
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartRes = await fetchCartAPI()
        setCartDetail(cartRes.cartDetail)
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error)
      }
    }
    fetchData()
  }, [])

  // Xử lý Submit
  const onOrderSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true)
    const payload = { ...data, note: data.note || '', paymentMethod }
    try {
      const response = await fetchOrderAPI(payload)
      if (response.code === 201) {
        await refreshCart()
        if (paymentMethod === 'COD') {
          dispatchAlert({ type: 'SHOW_ALERT', payload: { message: response.message, severity: 'success' } })
          navigate(`/checkout/success/${response.order._id}`)
        } else if (paymentMethod === 'VNPAY' && response.paymentUrl) {
          window.location.href = response.paymentUrl
        } else if (paymentMethod === 'ZALOPAY' && response.order_url) {
          window.location.href = response.order_url
        } else if (paymentMethod === 'MOMO' && response.data?.payUrl) {
          window.location.href = response.data.payUrl
        }
      } else {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: response.message, severity: 'error' } })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onOrderSubmit),
    errors,
    paymentMethod,
    setPaymentMethod,
    cartDetail,
    isLoading,
    isSubmitting
  }
}

export default useCheckout