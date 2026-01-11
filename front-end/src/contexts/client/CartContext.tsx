/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { fetchCartAPI, fetchAddProductToCartAPI } from '~/apis/client/cart.api'
import type { CartInfoInterface } from '~/types/cart.type'

interface CartContextType {
 cartDetail: CartInfoInterface | null
 addToCart: (
    productId: string,
    quantity: number,
    color?: string | null,
    size?: string | null
  ) => Promise<void>
 refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartClientProvider = ({ children }: { children: ReactNode }) => {
  const [cartDetail, setCartDetail] = useState<CartInfoInterface | null>(null)

  const refreshCart = async () => {
    try {
      const res = await fetchCartAPI()
      setCartDetail(res.cartDetail)
    } catch (error) {
      console.error('Failed to refresh cart:', error)
      setCartDetail(null)
    }
  }

  const addToCart = async (
    productId: string,
    quantity: number,
    color?: string | null,
    size?: string | null
  ) => {
    // Truyền thêm color và size vào hàm gọi API
    await fetchAddProductToCartAPI(productId, quantity, color, size)
    await refreshCart() // Cập nhật lại giỏ hàng để hiển thị thay đổi
  }

  useEffect(() => {
    refreshCart()
  }, [])

  return (
    <CartContext.Provider value={{ cartDetail, addToCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart phải dùng trong CartProvider')
  return context
}