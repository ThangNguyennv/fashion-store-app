import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductAPI } from '~/apis/admin/product.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { ProductDetailInterface, ProductInfoInterface } from '~/interfaces/product.interface'
import { FaStar, FaRegStar } from 'react-icons/fa'

export const useDetail = () => {
  const [productDetail, setProductDetail] = useState<ProductInfoInterface | null>(null)
  const params = useParams()
  const id = params.id
  const { role } = useAuth()

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductDetailInterface) => {
        setProductDetail(response.product)
      })
  }, [id])
  const renderStars = (average: number) => {
    const fullStars = Math.floor(average)
    const emptyStars = 5 - fullStars
    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => <FaStar key={`star-${i}`} />)}
        {Array.from({ length: emptyStars }, (_, i) => <FaRegStar key={`reg-star-${i}`} />)}
      </>
    )
  }
  return {
    productDetail,
    id,
    role,
    renderStars
  }
}