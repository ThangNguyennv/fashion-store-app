
/* eslint-disable no-console */
import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductAPI, fetchRelatedProductsAPI } from '~/apis/client/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useCart } from '~/contexts/client/CartContext'
import type { ProductDetailInterface, ProductInfoInterface } from '~/interfaces/product.interface'
import { useMemo } from 'react' // Import useMemo để tối ưu

const useDetail = () => {
  const [productDetail, setProductDetail] = useState<ProductInfoInterface | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(true)

  // === STATE ĐỂ QUẢN LÝ BỘ LỌC ĐÁNH GIÁ ===
  const [reviewFilter, setReviewFilter] = useState<'all' | 'media' | number>('all')
  const [visibleCount, setVisibleCount] = useState<number>(10)

  // === CẬP NHẬT STATE CHO MÀU SẮC VÀ ẢNH HIỂN THỊ ===
  const [selectedColor, setSelectedColor] = useState<ProductInfoInterface['colors'][0] | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState<string | File>('') // State cho ảnh chính

  const params = useParams()
  const slugProduct = params.slugProduct as string
  const { dispatchAlert } = useAlertContext()
  const { addToCart } = useCart()
  const [relatedProducts, setRelatedProducts] = useState<ProductInfoInterface[]>([])

  // RESET VỀ 10 KHI ĐỔI BỘ LỌC (Rất quan trọng)
  useEffect(() => {
    setVisibleCount(10)
  }, [reviewFilter])

  useEffect(() => {
    if (!slugProduct) return
    setLoading(true)
    fetchDetailProductAPI(slugProduct)
      .then((response: ProductDetailInterface) => {
        const product = response.product
        product.colors = product.colors || []
        product.sizes = product.sizes || []
        // Đảm bảo mỗi màu đều có mảng images
        product.colors.forEach(color => color.images = color.images || [])
        setProductDetail(product)

        if (product.colors.length > 0) {
          const initialColor = product.colors[0]
          setSelectedColor(initialColor)
          if (initialColor.images.length > 0) {
            setMainImage(initialColor.images[0])
          } else {
            setMainImage(product.thumbnail)
          }
        } else {
          setMainImage(product.thumbnail)
        }
        if (product.sizes.length > 0) {
          setSelectedSize(product.sizes[0])
        }
      })
      .finally(() => setLoading(false))

  }, [slugProduct])

  useEffect(() => {
    // Chỉ chạy khi đã có thông tin sản phẩm chính
    if (productDetail && productDetail._id) {
      const getRelated = async () => {
        try {
          const res = await fetchRelatedProductsAPI(productDetail._id ?? '')
          setRelatedProducts(res.products)
        } catch (error) {
          console.error('Lỗi khi lấy sản phẩm liên quan:', error)
        }
      }
      getRelated()
    }
  }, [productDetail])

  // === HÀM XỬ LÝ KHI CHỌN MÀU MỚI ===
  const handleColorSelect = (color: ProductInfoInterface['colors'][0]) => {
    setSelectedColor(color)
    if (color.images && color.images.length > 0) {
      setMainImage(color.images[0])
    }
  }
  const handleQuantityChange = (amount: number) => {
    if (!productDetail) return
    const newQuantity = quantity + amount
    if (newQuantity >= 1 && newQuantity <= productDetail.stock) {
      setQuantity(newQuantity)
    }
  }
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!productDetail) return

    // Kiểm tra xem người dùng đã chọn màu/size chưa (nếu sản phẩm có)
    if (productDetail.colors.length > 0 && !selectedColor) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn màu sắc', severity: 'error' } })
      return
    }
    if (productDetail.sizes.length > 0 && !selectedSize) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn kích cỡ', severity: 'error' } })
      return
    }

    try {
      await addToCart(productDetail._id ?? '', quantity, selectedColor?.name, selectedSize)
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Đã thêm vào giỏ hàng', severity: 'success' } })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Lỗi khi thêm vào giỏ', severity: 'error' } })
    }
  }

  // === XỬ LÝ DỮ LIỆU ĐÁNH GIÁ BẰNG useMemo ĐỂ TỐI ƯU HIỆU NĂNG ===
  const ratingCounts = useMemo(() => {
    if (!productDetail?.comments) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, media: 0 }
    interface RatingCounts {
      [key: number]: number // Cho phép truy cập bằng bất kỳ key nào là number
      media: number
    }
    const counts: RatingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, media: 0 }
    productDetail.comments.forEach(comment => {
      if (comment.rating >= 1 && comment.rating <= 5) {
        counts[comment.rating]++
      }
      if (comment.images && comment.images.length > 0) {
        counts.media++
      }
    })
    return counts
  }, [productDetail?.comments])

  const filteredComments = useMemo(() => {
    if (!productDetail?.comments) return []

    if (reviewFilter === 'all') {
      return productDetail.comments
    }
    if (reviewFilter === 'media') {
      return productDetail.comments.filter(c => c.images && c.images.length > 0)
    }
    return productDetail.comments.filter(c => c.rating === reviewFilter)
  }, [productDetail?.comments, reviewFilter])

  //  CẮT MẢNG ĐỂ HIỂN THỊ (Lấy từ 0 đến visibleCount)
  const displayedComments = useMemo(() => {
    return filteredComments.slice(0, visibleCount)
  }, [filteredComments, visibleCount])

  // HÀM XỬ LÝ NÚT "XEM THÊM"
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10)
  }
  return {
    loading,
    setReviewFilter,
    mainImage,
    relatedProducts,
    handleColorSelect,
    handleQuantityChange,
    handleSubmit,
    ratingCounts,
    filteredComments,
    selectedColor,
    productDetail,
    setMainImage,
    setSelectedSize,
    reviewFilter,
    quantity,
    selectedSize,
    handleLoadMore,
    displayedComments,
    visibleCount
  }
}

export default useDetail