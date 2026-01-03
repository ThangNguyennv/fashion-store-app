/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  fetchCartAPI,
  fetchDeleteProductInCartAPI,
  fetchUpdateVariantAPI,
  fetchUpdateQuantityAPI
} from '~/apis/client/cart.api'
import type { CartInfoInterface, CartItemInterface } from '~/types/cart.type'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const useCart = () => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)
  const [openDeleteOne, setOpenDeleteOne] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CartItemInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const { dispatchAlert } = useAlertContext()

  const refreshCart = useCallback(async () => {
    try {
      const cartRes = await fetchCartAPI()
      setCartDetail(cartRes.cartDetail)
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Lỗi khi fetch giỏ hàng', severity: 'error' } })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    refreshCart()
  }, [refreshCart])

  const handleOpenDeleteDialog = (item: CartItemInterface) => {
    setSelectedItem(item)
    setOpenDeleteOne(true)
  }

  const handleCloseDeleteDialog = () => {
    setSelectedItem(null)
    setOpenDeleteOne(false)
  }

  // const totalBill = useMemo(() => {
  //   if (!cartDetail?.products) return 0
  //   return cartDetail?.products.reduce((acc, item) => {
  //     const priceNewForOneProduct =
  //   item.product_id.price * (100 - item.product_id.discountPercentage) / 100

  //     return acc + priceNewForOneProduct * item.quantity
  //   }, 0)
  // }, [cartDetail])

  const handleDelete = async () => {
    if (!selectedItem) return
    const response = await fetchDeleteProductInCartAPI({
      productId: selectedItem.product_id._id as string,
      color: selectedItem.color,
      size: selectedItem.size
    })
    if (response.code === 204) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: response.message, severity: 'success' } })
      refreshCart()
      handleCloseDeleteDialog()
    } else {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Xóa thất bại!', severity: 'error' } })
    }
  }

  // === HÀM ĐỂ CẬP NHẬT COLOR/SIZE ===
  const handleVariantChange = async (
    item: CartItemInterface,
    newVariant: { color?: string; size?: string }
  ) => {
    if (!item) return

    const payload = {
      productId: item.product_id._id as string,
      oldColor: item.color,
      oldSize: item.size,
      newColor: newVariant.color ?? item.color,
      newSize: newVariant.size ?? item.size
    }

    try {
      const response = await fetchUpdateVariantAPI(payload)
      if (response.code === 200) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: response.message, severity: 'success' } })
        refreshCart() // Tải lại giỏ hàng để hiển thị thay đổi
      } else {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: response.message || 'Lỗi cập nhật', severity: 'error' } })
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Lỗi khi cập nhật phân loại', severity: 'error' } })
    }
  }

  const handleQuantityChange = async (item: CartItemInterface, newQuantity: number) => {
    if (newQuantity < 1 || !item.product_id || newQuantity > item.product_id.stock) return

    if (cartDetail) {
      const updatedProducts = cartDetail.products.map(p =>
        (p.product_id._id === item.product_id._id && p.color === item.color && p.size === item.size)
          ? { ...p, quantity: newQuantity, totalPrice: (p.product_id?.['priceNew'] || 0) * newQuantity }
          : p
      )
      setCartDetail({ ...cartDetail, products: updatedProducts })
    }

    try {
      await fetchUpdateQuantityAPI({
        productId: item.product_id._id as string,
        color: item.color,
        size: item.size,
        quantity: newQuantity
      })
      // Tải lại để đảm bảo tổng tiền đúng
      refreshCart()
    } catch (error) {
      refreshCart()
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Lỗi cập nhật số lượng', severity: 'error' } })
    }
  }

  return {
    cartDetail,
    handleVariantChange,
    handleQuantityChange,
    handleOpenDeleteDialog,
    openDeleteOne,
    handleCloseDeleteDialog,
    handleDelete,
    loading
  }
}

export default useCart