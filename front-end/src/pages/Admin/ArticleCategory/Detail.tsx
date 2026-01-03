import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/Admin/articleCategory/useDetail'

const DetailArticleCategory = () => {
  const {
    articleCategoryDetail,
    id,
    role
  } = useDetail()

  return (
    <>
      {role && role.permissions.includes('articles-category_view') && (
        articleCategoryDetail ? (
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px]'>
            <div className='text-[24px] font-[600] text-[#00171F]'>
            Chi tiết danh mục bài viết
            </div>
            <div className='flex justify-between gap-[10px] w-[50%]'>
              <div className='flex flex-col gap-[15px]'>
                <h1>
                  <b>Tên danh mục bài viết: </b>
                  {articleCategoryDetail.title}
                </h1>
                <div className='flex flex-col gap-[10px]'>
                  <b>Ảnh: </b>
                  <img
                    src={articleCategoryDetail.thumbnail}
                    alt={articleCategoryDetail.title}
                    className='w-[150px] h-[150px]'
                  />
                </div>
                <div>
                  <b>Trạng thái:</b>
                  {
                    articleCategoryDetail.status === 'ACTIVE' ?
                      <span className="text-green-500 font-[600]">Hoạt động</span> :
                      <span className="text-red-500 font-[600]"> Dừng hoạt động</span>
                  }
                </div>
                <div className='flex items-center gap-[5px]'>
                  <b>Mô tả ngắn: </b>
                  <span dangerouslySetInnerHTML={{ __html: articleCategoryDetail.descriptionShort }} />
                </div>
                <div className='flex items-center gap-[5px]'>
                  <b>Mô tả chi tiết: </b>
                  <span dangerouslySetInnerHTML={{ __html: articleCategoryDetail.descriptionDetail }} />
                </div>
                <div className='flex items-center justify-start gap-[5px]'>
                  <Link
                    to={`/admin/articles-category/edit/${id}`}
                    className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
                  >
                    Chỉnh sửa
                  </Link>
                  <Link
                    to={'/admin/articles-category'}
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
              <Skeleton variant="text" width={365} height={48} sx={{ bgcolor: 'grey.400' }}/>
              <div className='flex justify-between gap-[10px] w-[50%]'>
                <div className='flex flex-col gap-[15px]'>
                  <Skeleton variant="text" width={385} height={48} sx={{ bgcolor: 'grey.400' }}/>
                  <div className='flex flex-col gap-[10px]'>
                    <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="rectangular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
                  </div>
                  <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={330} height={32} sx={{ bgcolor: 'grey.400' }}/>
                  <Skeleton variant="text" width={330} height={32} sx={{ bgcolor: 'grey.400' }}/>
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

export default DetailArticleCategory