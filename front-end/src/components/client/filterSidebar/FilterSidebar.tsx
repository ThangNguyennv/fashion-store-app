/* eslint-disable no-console */
import { useState, type ChangeEvent, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchFilterDataAPI } from '~/apis/client/product.api'
import Skeleton from '@mui/material/Skeleton'
import { FilterSection } from '../filterSection/FilterSection'

// Định nghĩa kiểu dữ liệu cho bộ lọc
interface Color { name: string; code: string }
interface Category { _id: string; title: string; slug: string }
interface FilterData {
  categories: Category[]
  colors: Color[]
  sizes: string[]
  maxPrice: number
}

// Component Skeleton cho bộ lọc
const FilterSkeleton = () => (
  <div className="w-full bg-white rounded-lg p-4">
    <div className="flex items-center justify-between border-b pb-6">
      <Skeleton variant="text" width={100} height={30} />
      <Skeleton variant="text" width={80} height={24} />
    </div>
    <div className="py-6 border-b">
      <Skeleton variant="text" width="50%" height={28} />
      <div className="mt-4 flex flex-col gap-3">
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
      </div>
    </div>
    <div className="py-6 border-b">
      <Skeleton variant="text" width="30%" height={28} />
      <div className="mt-4">
        <Skeleton variant="rectangular" width="100%" height={16} />
        <div className="flex justify-between mt-2">
          <Skeleton variant="text" width={40} height={20} />
          <Skeleton variant="text" width={60} height={20} />
        </div>
      </div>
    </div>
    <div className="py-6 border-b">
      <Skeleton variant="text" width="40%" height={28} />
      <div className="flex flex-wrap gap-3 mt-4">
        {Array.from(new Array(6)).map((_, i) => (
          <Skeleton key={i} variant="circular" width={32} height={32} />
        ))}
      </div>
    </div>
    <div className="py-6">
      <Skeleton variant="text" width="40%" height={28} />
      <div className="flex flex-wrap gap-2 mt-4">
        {Array.from(new Array(4)).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={80} height={36} />
        ))}
      </div>
    </div>
  </div>
)

interface FilterSidebarProps {
  onClose?: () => void; // Làm cho nó tùy chọn
}

export const FilterSidebar = ({ onClose }: FilterSidebarProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterData, setFilterData] = useState<FilterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Đọc giá trị filter hiện tại từ URL
  const activeCategory = searchParams.get('category') || ''
  const activeColor = searchParams.get('color') || ''
  const activeSize = searchParams.get('size') || ''
  // Lấy maxPrice từ URL, nếu không có thì set mặc định khi có data
  const currentMaxPrice = searchParams.get('maxPrice')

  // Gọi API để lấy dữ liệu filter
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true)
        const res = await fetchFilterDataAPI()
        if (res.code === 200) {
          setFilterData(res.filters)
        }
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu filter:', error)
      } finally {
        setIsLoading(false)
      }
    }
    getData()
  }, [])

  // Hàm helper để cập nhật URL
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value && newParams.get(key) !== value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    newParams.set('page', '1') // Luôn reset về trang 1 khi filter
    setSearchParams(newParams)
    if (onClose) {
      onClose()
    }
  }

  // Hàm xử lý thanh trượt giá
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('maxPrice', e.target.value)
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  if (isLoading) {
    return <FilterSkeleton />
  }

  if (!filterData) {
    return <div>Không thể tải bộ lọc.</div>
  }

  const priceValue = currentMaxPrice ?? filterData.maxPrice

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between border-b pb-6">
        <h2 className="text-xl font-bold lg:flex hidden">Bộ lọc</h2>
        <button
          onClick={() => {
            setSearchParams({})
            if (onClose) onClose()
          } }
          className="text-sm text-gray-500 hover:text-black"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Filter Danh mục */}
      <FilterSection title="Danh mục">
        <div className="flex flex-col items-start gap-3">
          {filterData.categories.map((category) => (
            <button
              key={category._id}
              onClick={() => updateFilter('category', category.slug)}
              className={`text-gray-600 hover:text-black ${activeCategory === category.slug ? 'font-bold text-black' : ''}`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Filter Giá */}
      <FilterSection title="Giá">
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min="0"
            max={filterData.maxPrice}
            value={priceValue}
            onChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0đ</span>
            <span>{Number(priceValue).toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </FilterSection>

      {/* Filter Màu sắc */}
      <FilterSection title="Màu sắc">
        <div className="flex flex-wrap gap-3">
          {filterData.colors.map((color) => (
            <button
              key={color.code}
              title={color.name}
              onClick={() => updateFilter('color', color.name)}
              className={`h-8 w-8 rounded-full border border-gray-200 ${activeColor === color.name ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              style={{ backgroundColor: color.code }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Filter Kích cỡ */}
      <FilterSection title="Kích cỡ">
        <div className="flex flex-wrap gap-2">
          {filterData.sizes.map((size) => (
            <button
              key={size}
              onClick={() => updateFilter('size', size)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${activeSize === size ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

