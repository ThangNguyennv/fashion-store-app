import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import CardItem from '../cardItem/CardItem'
import { Link } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'
import type { ProductInfoInterface } from '~/types/product.type'

interface SliderWrapperProps {
  items: ProductInfoInterface[]
  // slidesPerView: Giá trị mặc định sẽ được ghi đè bởi breakpoints
  autoplayDelay?: number
  loading?: boolean
}

export default function SliderWrapper ({
  items,
  // slidesPerView được quản lý bởi breakpoints
  autoplayDelay = 3000,
  loading = false // Mặc định không loading
}: SliderWrapperProps) {

  const CardItemSkeleton = () => (
    <div className="flex flex-col items-center gap-[15px] rounded-[5px] border border-gray-200 bg-white p-[10px] text-center h-full">
      <Skeleton variant="rectangular" width="100%" height={250} />
      <div className="flex flex-col items-center gap-2 px-2 pb-2 w-full">
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" height={28} />
      </div>
    </div>
  )

  const maxSlidesPerView = 5
  // Chỉ bật 'loop' nếu số lượng item LỚN HƠN số slide hiển thị
  const enableLoop = items.length > maxSlidesPerView

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={15}
      slidesPerView={1} // Mặc định cho mobile
      navigation
      pagination={{ clickable: true }}
      loop={enableLoop}
      autoplay={{
        delay: autoplayDelay,
        disableOnInteraction: false
      }}
      // THÊM BREAKPOINTS CHO RESPONSIVE
      breakpoints={{
        // khi chiều rộng màn hình >= 640px (sm)
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        // khi chiều rộng màn hình >= 768px (md)
        768: {
          slidesPerView: 3,
          spaceBetween: 25
        },
        // khi chiều rộng màn hình >= 1024px (lg)
        1024: {
          slidesPerView: 4,
          spaceBetween: 30
        },
        // khi chiều rộng màn hình >= 1280px (xl)
        1280: {
          slidesPerView: 5,
          spaceBetween: 30
        }
      }}
    >
      {loading ? (
        [...Array(5)].map((_, index) => (
          <SwiperSlide key={index}>
            <CardItemSkeleton />
          </SwiperSlide>
        ))
      ) : (
        items && items.length > 0 && (
          items.map((item) => (
            <SwiperSlide key={item._id || item.slug || item.title}>
              <Link to={`/products/detail/${item.slug}`}>
                <CardItem item={item} />
              </Link>
            </SwiperSlide>
          ))
        )
      )}
    </Swiper>
  )
}
