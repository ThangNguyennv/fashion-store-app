import { FaStar, FaCheckCircle } from 'react-icons/fa'

// Định nghĩa kiểu dữ liệu cho một testimonial
export interface Testimonial {
  name: string
  quote: string
  rating: number
  verified?: boolean
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div>
        {/* Hàng Sao */}
        <div className="flex gap-1 text-lg text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>

        {/* Tên Khách hàng */}
        <div className="mt-4 flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
          {testimonial.verified && (
            <FaCheckCircle className="text-green-500" title="Đã xác minh" />
          )}
        </div>

        {/* Nội dung Cảm nhận */}
        <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-5">
          &quot;{testimonial.quote}&quot;
        </p>
      </div>
    </div>
  )
}

export default TestimonialCard

