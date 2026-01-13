import { Link } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import type { ArticleInfoInterface } from '~/interfaces/article.interface'
import Skeleton from '@mui/material/Skeleton'
import ArticleCard from '../articleCard/ArticleCard'

interface BrandSliderProps {
  items: ArticleInfoInterface[],
  loading?: boolean
}

export default function BrandSlider({ items, loading = false }: BrandSliderProps) {
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

  return (
    <div className="overflow-hidden bg-gray-100 py-4">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1} // số item hiển thị cùng lúc
        spaceBetween={20} // khoảng cách giữa item
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={3000} // tốc độ (ms) để trượt hết 1 vòng
        loop={true}
        freeMode={true} // cho phép kéo tự do
        grabCursor={true} // đổi con trỏ chuột thành “nắm kéo”
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
            items.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to={`/articles/detail/${item.slug}`}>
                  <ArticleCard item={item} />
                </Link>
              </SwiperSlide>
            ))
          )
        )}
      </Swiper>
    </div>
  )
}