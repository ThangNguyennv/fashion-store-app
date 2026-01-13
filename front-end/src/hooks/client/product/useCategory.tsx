
/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductCategoryAPI } from '~/apis/client/product.api'
import type { ProductInfoInterface, ProductsWithCategoryDetailInterface } from '~/interfaces/product.interface'

const useCategory = () => {
  const [productCategory, setProductCategory] = useState<ProductInfoInterface[]>([])
  const [pageTitle, setPageTitle] = useState('')
  const params = useParams()
  const slugCategory = params.slugCategory as string
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res: ProductsWithCategoryDetailInterface = await fetchDetailProductCategoryAPI(slugCategory)
        setProductCategory(res.products)
        setPageTitle(res.pageTitle)
      } catch (error) {
        console.error('Lỗi khi fetch danh mục sản phẩm:', error)
        setPageTitle('Không tìm thấy danh mục')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slugCategory])
  return {
    productCategory,
    pageTitle,
    loading
  }
}

export default useCategory