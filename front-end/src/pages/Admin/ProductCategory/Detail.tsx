import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/Admin/ProductCategory/useDetail'

const DetailProductCategory = () => {
  const {
    productCategoryDetail,
    id,
    role
  } = useDetail()

  return (
    <>
      {role && role.permissions.includes('products-category_view') && (
        productCategoryDetail ? (
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px]'>
            <div className='text-[24px] font-[600] text-[#00171F]'>
            Chi tiết danh mục sản phẩm
            </div>
            <div className='flex justify-between gap-[10px] w-[50%]'>
              <div className='flex flex-col gap-[15px]'>
                <h1>
                  <b>Tên danh mục sản phẩm: </b>
                  {productCategoryDetail.title}
                </h1>
                <div className='flex flex-col gap-[10px]'>
                  <b>Ảnh: </b>
                  <img
                    src={productCategoryDetail.thumbnail}
                    alt={productCategoryDetail.title}
                    className='w-[150px] h-[150px]'
                  />
                </div>
                <div>
                  <b>Trạng thái: </b>
                  {
                    productCategoryDetail.status === 'ACTIVE' ?
                      <span className="text-green-500 font-[600]">Hoạt động</span> :
                      <span className="text-red-500 font-[600]"> Dừng hoạt động</span>
                  }
                </div>
                <div className='flex items-center gap-[5px]'>
                  <b>Mô tả: </b>
                  <span dangerouslySetInnerHTML={{ __html: productCategoryDetail.description }} />
                </div>
                <div className='flex items-center justify-start gap-[5px]'>
                  <Link
                    to={`/admin/products-category/edit/${id}`}
                    className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
                  >
                    Chỉnh sửa
                  </Link>
                  <Link
                    to={'/admin/products-category'}
                    className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
                  >
                    Quay lại
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px]'>
              <Skeleton variant="text" width={385} height={48} sx={{ bgcolor: 'grey.400' }}/>
              <div className='flex justify-between gap-[10px] w-[50%]'>
                <div className='flex flex-col gap-[15px]'>
                  <Skeleton variant="text" width={385} height={48} sx={{ bgcolor: 'grey.400' }}/>
                  <div className='flex flex-col gap-[10px]'>
                    <Skeleton variant="text" width={100} height={48} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="rectangular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                  <Skeleton variant="text" width={120} height={120} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="rectangular" width={100} height={36} sx={{ bgcolor: 'grey.400' }}/>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </>
  )
}

export default DetailProductCategory