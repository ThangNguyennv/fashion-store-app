import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/Admin/Product/useDetail'

const DetailProduct = () => {
  const {
    productDetail,
    id,
    role,
    renderStars
  } = useDetail()

  return (
    <>
      {role && role.permissions.includes('products_view') && (
        productDetail ? (
          <div className='bg-[#FFFFFF] p-6 shadow-md mt-4'>
            <div className='mb-6 pb-4 border-b'>
              <h1 className='text-3xl font-bold text-gray-800'>{productDetail.title}</h1>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='flex items-center justify-center'>
                <img
                  src={productDetail.thumbnail}
                  alt={productDetail.title}
                  className='w-[full] h-[400px] object-cover rounded-lg shadow-md'
                />
              </div>

              <div className='flex flex-col gap-6'>
                <div>
                  <div className='flex items-baseline gap-3 mb-3'>
                    <span className='text-3xl font-bold text-red-600'>
                      {Math.floor(productDetail.price * (100 - productDetail.discountPercentage) / 100).toLocaleString('vi-VN')}đ
                    </span>
                    <span className='text-xl line-through text-gray-500'>
                      {productDetail.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className='bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded'>
                      -{productDetail.discountPercentage}%
                    </span>
                  </div>
                  {productDetail.stars && (
                    <div className="flex items-center gap-2 text-yellow-500">
                      {renderStars(productDetail.stars.average)}
                      <span className="text-gray-600 text-sm ml-2">
                        ({productDetail.stars.average.toFixed(1)} / {productDetail.stars.count} đánh giá)
                      </span>
                    </div>
                  )}
                </div>

                <hr/>

                <div className='flex flex-col gap-4'>
                  <div>
                    <h3 className='font-semibold mb-2'>Màu sắc:</h3>
                    <div className="flex flex-wrap gap-3">
                      {productDetail.colors && productDetail.colors.length > 0 ? (
                        productDetail.colors.map((color, index) => (
                          <span
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer shadow"
                            style={{ backgroundColor: color.code }}
                            title={color.name}
                          ></span>
                        ))
                      ) : <span className='text-gray-500 text-sm'>Chưa có thông tin.</span>}
                    </div>
                  </div>
                  <div>
                    <h3 className='font-semibold mb-2'>Kích cỡ:</h3>
                    <div className="flex flex-wrap gap-2">
                      {productDetail.sizes && productDetail.sizes.length > 0 ? (
                        productDetail.sizes.map((size, index) => (
                          <span key={index} className="border px-3 py-1 rounded-md text-sm bg-gray-100">
                            {size}
                          </span>
                        ))
                      ) : <span className='text-gray-500 text-sm'>Chưa có thông tin.</span>}
                    </div>
                  </div>
                </div>

                <hr/>

                <div className='text-sm grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg'>
                  <div><b>Tồn kho:</b> {productDetail.stock} sản phẩm</div>
                  <div><b>Trạng thái:</b> {
                    productDetail.status === 'ACTIVE' ?
                      <span className="text-green-600 font-semibold">● Hoạt động</span> :
                      <span className="text-red-600 font-semibold">● Dừng hoạt động</span>
                  }
                  </div>
                </div>

                <div className='flex items-center justify-start gap-[5px]'>
                  <Link
                    to={`/admin/products/edit/${id}`}
                    className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
                  >
                    Chỉnh sửa
                  </Link>
                  <Link
                    to={'/admin/products'}
                    className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
                  >
                  Quay lại
                  </Link>
                </div>
              </div>
            </div>

            <div className='mt-10 pt-6 border-t'>
              <h2 className='text-2xl font-bold mb-4'>Mô tả sản phẩm</h2>
              <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: productDetail.description }} />
            </div>

          </div>
        ) : (
          <>
            <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <div className='flex justify-between gap-[10px] border rounded-[5px] p-[20px] w-[50%]'>
              <div className='flex flex-col gap-[15px]'>
                <Skeleton variant="text" width={385} height={48} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={100} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
              </div>
              <div>
                <Skeleton variant="text" width={34} height={20} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="rectangular" width={317} height={350} sx={{ bgcolor: 'grey.400' }}/>
              </div>
            </div>
          </>
        )
      )}
    </>
  )
}

export default DetailProduct