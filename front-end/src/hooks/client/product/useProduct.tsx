import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProductContext } from '~/contexts/client/ProductContext'
import type { AllParams } from '~/interfaces/helper.interface'

const useProduct = () => {
  const { stateProduct, fetchProduct } = useProductContext()
  const { products, pagination, isLoading } = stateProduct
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  // Parse URL params một lần
  const urlParams = useMemo(() => ({
    page: parseInt(searchParams.get('page') || '1', 10),
    keyword: searchParams.get('keyword') || '',
    sortKey: searchParams.get('sortKey') || '',
    sortValue: searchParams.get('sortValue') || '',
    category: searchParams.get('category') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    color: searchParams.get('color') || '',
    size: searchParams.get('size') || ''
  }), [searchParams])

  useEffect(() => {
    fetchProduct(urlParams)
  }, [urlParams.page, urlParams.keyword, urlParams.sortKey, urlParams.sortValue, urlParams.category, urlParams.color, urlParams.size, urlParams.maxPrice, fetchProduct, urlParams])

  // Khóa cuộn trang khi mở filter trên mobile
  useEffect(() => {
    document.body.style.overflow = (isFilterOpen || isSortOpen) ? 'hidden' : 'auto'
  }, [isFilterOpen, isSortOpen])

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

  // const handleSortChange = (key: string, value: string) => {
  //   const newParams = new URLSearchParams(searchParams)
  //   newParams.set('sortKey', key)
  //   newParams.set('sortValue', value)
  //   newParams.set('page', '1') // Luôn reset về trang 1 khi sắp xếp
  //   setSearchParams(newParams)
  //   setIsSortOpen(false) // Đóng drawer sort (nếu đang mở)
  // }
  const handleSort = useCallback((sortKey: string, sortValue: string): void => {
    updateParams({ sortKey, sortValue, page: 1 })
    setIsSortOpen(false)
  }, [updateParams])

  return {
    products,
    setIsFilterOpen,
    setIsSortOpen,
    pagination,
    updateParams,
    isFilterOpen,
    isSortOpen,
    handleSort,
    sortKey: urlParams.sortKey,
    sortValue: urlParams.sortValue,
    isLoading
  }
}

export default useProduct