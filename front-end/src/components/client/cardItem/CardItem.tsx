import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa' // Import icon sao
import type { ProductInfoInterface } from '~/types/product.type'

type CardItemProps = {
  item: ProductInfoInterface
}

const CardItem = ({ item }: CardItemProps) => {
  if (!item) {
    return null
  }
  // Hàm render số sao
  const renderStars = (currentRating: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(currentRating)) {
        stars.push(<FaStar key={i} className="text-yellow-400" />)
      } else if (i === Math.floor(currentRating) && currentRating % 1 !== 0) {
        // Xử lý sao nửa (chỉ làm đơn giản, không chính xác icon nửa sao)
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />)
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />)
      }
    }
    return stars
  }

  const price = item.price ?? 0
  const discountPercentage = item.discountPercentage ?? 0
  const averageRating = item.stars?.average ?? 0
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ'
  }

  const discountedPrice = (price > 0 && discountPercentage > 0)
    ? Math.floor(price * (100 - discountPercentage) / 100)
    : price

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }} // Hiệu ứng hover mượt mà hơn
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative flex flex-col items-center gap-[15px] rounded-[5px] border border-gray-200 bg-white p-[10px] text-center shadow-sm transition-shadow hover:shadow-md cursor-pointer h-full"
    >
      {/* Tag nổi bật */}
      {item.featured === '1' && (
        <div className="absolute left-[-5px] top-[15px] rounded-r-lg bg-[#0542AB] px-3 py-1 text-xs font-semibold uppercase text-white shadow-md z-[500]">
          Nổi bật
        </div>
      )}

      {discountPercentage > 0 && (
        <div className="absolute right-0 top-0 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-tr-md rounded-bl-md z-[500]">
          -{discountPercentage}%
        </div>
      )}

      <div className="relative w-full overflow-hidden rounded-md pt-2">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-[200px] w-full object-contain transition-transform duration-300 hover:scale-105 sm:h-[250px]"
        />
      </div>

      <div className="flex flex-col items-center gap-2 px-2 pb-2 w-full">
        <span className="min-h-[40px] text-base font-semibold text-gray-800 line-clamp-2 hover:text-blue-700">
          {item.title}
        </span>

        {/* Phần đánh giá sao */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          {renderStars(averageRating)}
          <span className="ml-1 text-gray-500">
            {(averageRating).toFixed(1)}/5
          </span>
        </div>

        {/* Phần giá */}
        <div className="mt-2 flex items-center justify-center gap-2 text-lg font-bold min-h-[28px]">
          {discountPercentage > 0 ? (
            <>
              <span className="text-red-600">{formatCurrency(discountedPrice)}</span>
              <span className="text-gray-400 line-through text-sm font-normal">
                {formatCurrency(price)}
              </span>
            </>
          ) : (
            <span className="text-gray-800">{formatCurrency(price)}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CardItem
