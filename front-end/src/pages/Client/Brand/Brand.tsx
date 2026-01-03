import { Link } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'
import useBrand from '~/hooks/client/brand/useBrand'

const BrandSkeleton = () => (
  <div className="flex flex-col items-center gap-3 p-4 border rounded-lg shadow-sm">
    <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: '8px' }} />
    <Skeleton variant="text" width={80} height={24} />
  </div>
)

const BrandPage = () => {
  const {
    brandGroups,
    loading
  } = useBrand()

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 mb-[100px]">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Tất Cả Thương Hiệu
      </h1>

      {loading ? (
        <div className="flex flex-col gap-12">
          <div>
            <Skeleton variant="text" width={250} height={40} sx={{ fontSize: '1.875rem' }} />
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, j) => (
                <BrandSkeleton key={j} />
              ))}
            </div>
          </div>
        </div>
      ) : brandGroups.length > 0 ? (
        // === Hiển thị dữ liệu ===
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {brandGroups.map((group) => (
            <Link
              to={''}
              key={group._id}
              className="flex flex-col items-center gap-3 p-4 border rounded-lg shadow-sm bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={group.thumbnail}
                alt={group.title}
                className="w-28 h-28 object-contain"
              />
              <span className="font-semibold text-gray-800">{group.title}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-16">
          Không tìm thấy thương hiệu nào.
        </p>
      )}
    </div>
  )
}

export default BrandPage

