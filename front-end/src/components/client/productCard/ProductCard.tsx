import { Link } from 'react-router-dom'
import type { ProductInfoInterface } from '~/types/product.type'
import { FaStar, FaRegStar } from 'react-icons/fa'

interface ProductCardProps {
  product: ProductInfoInterface
}

const ProductCard = ({ product }: ProductCardProps) => {
  const priceNew = Math.floor((product.price * (100 - product.discountPercentage)) / 100)
  const renderStars = (average: number) => {
    const fullStars = Math.floor(average)
    const emptyStars = 5 - fullStars
    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => <FaStar key={`star-${i}`} />)}
        {Array.from({ length: emptyStars }, (_, i) => <FaRegStar key={`reg-star-${i}`} />)}
      </>
    )
  }
  return (
    <Link to={`/products/detail/${product.slug}`} className="block group">
      <div className="overflow-hidden rounded-lg">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-[300px] object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 text-yellow-500">
          {renderStars(product.stars.average)}
          <span className="text-gray-600 text-sm ml-2">
            ({product.stars.average.toFixed(1)} / 5)
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-red-600">{priceNew.toLocaleString('vi-VN')}đ</span>
          {product.discountPercentage > 0 && (
            <span className="text-sm line-through text-gray-400">{product.price.toLocaleString('vi-VN')}đ</span>
          )}
          <span className='bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded'>
            -{product.discountPercentage}%
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard