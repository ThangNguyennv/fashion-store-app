/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useOrderContext } from '~/contexts/client/OrderContext'
import { fetchCancelOrder } from '~/apis/client/user.api'
import type { OrderStatus } from '~/types/order.type'
import { useCart } from '~/contexts/client/CartContext'
import { submitReviewAPI } from '~/apis/client/product.api'
import type { AllParams } from '~/types/helper.type'

const useMyOrder = () => {
  const { stateOrder, fetchOrder, dispatchOrder } = useOrderContext()
  const { orders, pagination } = stateOrder
  const { dispatchAlert } = useAlertContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  // Parse URL params một lần
  const urlParams = useMemo(() => ({
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
    keyword: searchParams.get('keyword') || '',
    sortKey: searchParams.get('sortKey') || '',
    sortValue: searchParams.get('sortValue') || '',
    date: searchParams.get('date') || ''
  }), [searchParams])

  const [typeStatusOrder, setTypeStatusOrder] = useState((urlParams.status || '').toUpperCase())
  const [selectedDate, setSelectedDate] = useState(urlParams.date || '')
  useEffect(() => {
    setTypeStatusOrder((urlParams.status || '').toUpperCase())
    setSelectedDate(urlParams.date || '')
  }, [urlParams.status, urlParams.date])

  const { addToCart } = useCart()

  // === THÊM STATE CHO POPUP ĐÁNH GIÁ ===
  const [openReview, setOpenReview] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productToReview, setProductToReview] = useState<any | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [reviewImages, setReviewImages] = useState<File[]>([])
  const [reviewPreviews, setReviewPreviews] = useState<string[]>([])

  useEffect(() => {
    fetchOrder(urlParams)
  }, [fetchOrder, urlParams])

  const updateParams = useCallback((params: Partial<AllParams>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newParams.set(key, value.toString())
      } else {
        newParams.delete(key)
      }
    })
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }

  const handleCancel = async () => {
    if (!selectedId) return

    const response = await fetchCancelOrder(selectedId)
    if (response.code === 200) {
      const updatedOrders = orders.map(order =>
        order._id === selectedId
          ? { ...order, status: 'CANCELED' as OrderStatus }
          : order
      )
      dispatchOrder({
        type: 'SET_DATA',
        payload: {
          orders: updatedOrders
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpen(false)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  // Xử lý cho từng sản phẩm
  const handleBuyBack = async (product_id: string, quantity: number, color: string, size: string) => {
    try {
      await addToCart(product_id, quantity, color, size)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: {
          message: 'Đã thêm vào giỏ hàng!',
          severity: 'success'
        }
      })
    } catch (error) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: {
          message: 'Lỗi khi mua lại',
          severity: 'error'
        }
      })
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    updateParams({ status: typeStatusOrder.toLowerCase(), date: selectedDate, page: 1 })
  }

  const statusToStep = {
    PENDING: 0,
    TRANSPORTING: 1,
    CONFIRMED: 2,
    CANCELED: 3
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenReview = (product: any, orderId: string) => {
    setProductToReview({ ...product, orderId }) // Lưu cả orderId nếu cần
    setOpenReview(true)
  }

  const handleCloseReview = () => {
    setOpenReview(false)
    // Reset state để lần sau mở lại không bị dính dữ liệu cũ
    setProductToReview(null)
    setReviewRating(5)
    setReviewContent('')
    setReviewImages([])
    setReviewPreviews([])
  }

  const handleReviewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      setReviewImages(prev => [...prev, ...newFiles])
      setReviewPreviews(prev => [...prev, ...newPreviews])
    }
  }

  const handleRemoveReviewImage = (index: number) => {
    URL.revokeObjectURL(reviewPreviews[index])
    setReviewImages(prev => prev.filter((_, i) => i !== index))
    setReviewPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleReviewSubmit = async () => {
    if (!productToReview || reviewRating === 0) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn số sao!', severity: 'error' } })
      return
    }

    const formData = new FormData()
    formData.append('rating', String(reviewRating))
    formData.append('content', reviewContent)
    reviewImages.forEach(file => {
      formData.append('images', file)
    })
    if (productToReview.color) {
      formData.append('color', productToReview.color)
    }
    if (productToReview.size) {
      formData.append('size', productToReview.size)
    }
    try {
      const response = await submitReviewAPI(productToReview.product_id, formData)
      if (response.code === 201) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Đánh giá đã được gửi!', severity: 'success' } })
        handleCloseReview()
        // Cập nhật lại trạng thái đơn hàng (ví dụ: đã đánh giá) nếu cần
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Có lỗi xảy ra', severity: 'error' } })
    }
  }
  return {
    pagination,
    handleReviewSubmit,
    handleRemoveReviewImage,
    handleReviewImageChange,
    handleOpenReview,
    statusToStep,
    handleSubmit,
    open,
    setTypeStatusOrder,
    openReview,
    updateParams,
    handleOpen,
    handleClose,
    handleCancel,
    handleBuyBack,
    typeStatusOrder,
    orders,
    handleCloseReview,
    productToReview,
    reviewContent,
    setReviewRating,
    reviewRating,
    setReviewContent,
    reviewPreviews,
    selectedDate,
    setSelectedDate
  }
}

export default useMyOrder