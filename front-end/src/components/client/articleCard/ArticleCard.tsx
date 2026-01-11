import { motion } from 'framer-motion'
import type { ArticleInfoInterface } from '~/types/article.type'

type CardItemProps = {
  item: ArticleInfoInterface
}

const ArticleCard = ({ item }: CardItemProps) => {
  if (!item) {
    return null
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }} // Hiệu ứng hover mượt mà hơn
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative flex flex-col items-center gap-[15px] rounded-[5px] border border-gray-200 bg-white p-[10px] text-center shadow-sm transition-shadow hover:shadow-md cursor-pointer h-full"
    >
      {/* Tag nổi bật */}
      {item.featured === '1' && (
        <div className="absolute left-[-5px] top-[15px] rounded-r-lg bg-[#0542AB] px-3 py-1 text-xs font-semibold uppercase text-white shadow-md z-50">
          Nổi bật
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
      </div>
    </motion.div>
  )
}

export default ArticleCard
