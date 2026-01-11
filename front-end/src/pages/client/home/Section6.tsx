/* eslint-disable no-console */
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import TestimonialCard, {
  type Testimonial
} from '~/components/client/testimonialCard/TestimonialCard'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { fetchTopRatedReviewsAPI } from '~/apis/client/product.api'
import Skeleton from '@mui/material/Skeleton'

// Import CSS cho Swiper
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import '~/testimonial-slider.css'

const Section6 = () => {
  // 5. Thêm state
  const [reviews, setReviews] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  // 6. Thêm useEffect để fetch data
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true)
        const res = await fetchTopRatedReviewsAPI()
        if (res.code === 200) {
          setReviews(res.reviews)
        }
      } catch (error) {
        console.error('Không thể tải cảm nhận:', error)
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [])

  // Component Skeleton cho loading
  const CardSkeleton = () => (
    <div className="flex h-full flex-col justify-between rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <Skeleton variant="rectangular" width={120} height={28} />
        <Skeleton variant="text" width="60%" height={28} sx={{ mt: 2 }} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
      </div>
    </div>
  )

  return (
    <div className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Tiêu đề và Nút điều hướng (không đổi) */}
        <div className="mb-8 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left">
          <h2 className="flex flex-wrap justify-center font-bold sm:text-[40px] text-[32px] text-primary sm:mb-0 mb-6 uppercase">
            Cảm nhận của khách hàng
          </h2>
          <div className="flex gap-4">
            <button
              className="custom-prev-el grid h-12 w-12 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-100"
              aria-label="Previous slide"
            >
              <FaArrowLeft />
            </button>
            <button
              className="custom-next-el grid h-12 w-12 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-100"
              aria-label="Next slide"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* 7. Cập nhật Slider */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={2} // Mặc định cho mobile
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.custom-next-el',
            prevEl: '.custom-prev-el'
          }}
          breakpoints={{
            640: {
              slidesPerView: 2
            },
            // iPad
            768: {
              slidesPerView: 3
            },
            // Desktop
            1024: {
              slidesPerView: 4
            },
            1280: {
              slidesPerView: 5
            },
            1536: {
              slidesPerView: 5
            }
          }}
          className="testimonial-swiper" // Thêm class để CSS tùy chỉnh
        >
          {loading ? (
            // Hiển thị skeleton khi đang tải
            [...Array(3)].map((_, index) => (
              <SwiperSlide key={index} className="h-auto p-1 pb-12">
                <CardSkeleton />
              </SwiperSlide>
            ))
          ) : (
            // Hiển thị dữ liệu thật
            reviews.map((testimonial, index) => (
              <SwiperSlide key={index} className="h-auto p-1 pb-12">
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  )
}

export default Section6

