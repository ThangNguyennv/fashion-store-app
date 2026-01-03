import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/Admin/article/useDetail'

const DetailArticle = () => {
  const {
    articleDetail,
    id,
    role
  } = useDetail()

  return (
    <>
      {role && role.permissions.includes('articles_view') && (
        articleDetail ? (
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px]'>
            <div className='text-[24px] font-[600] text-[#00171F]'>
            Chi tiết bài viết
            </div>
            <div className='flex justify-between gap-[10px] w-[50%]'>
              <div className='flex flex-col gap-[15px]'>
                <h1>
                  <b>Tên bài viết: </b>
                  {articleDetail.title}
                </h1>
                <div>
                  <b>Trạng thái:</b>
                  {
                    articleDetail.status === 'ACTIVE' ?
                      <span className="text-green-500 font-[600]"> Hoạt động</span> :
                      <span className="text-red-500 font-[600]"> Dừng hoạt động</span>
                  }
                </div>
                <div>
                  <b>Mô tả ngắn: </b>
                  <div dangerouslySetInnerHTML={{ __html: articleDetail.descriptionShort }} />
                </div>
                <div>
                  <b>Mô tả chi tiết: </b>
                  <div dangerouslySetInnerHTML={{ __html: articleDetail.descriptionDetail }} />
                </div>
                <div className='flex items-center justify-start gap-[5px]'>
                  <Link
                    to={`/admin/articles/edit/${id}`}
                    className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
                  >
                  Chỉnh sửa
                  </Link>
                  <Link
                    to={'/admin/articles'}
                    className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
                  >
                  Quay lại
                  </Link>
                </div>
              </div>
              <div>
                <b>Ảnh: </b>
                <img
                  src={articleDetail.thumbnail}
                  alt={articleDetail.title}
                  className='w-[150px] h-[150px]'
                />
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px]'>
            <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <div className='flex justify-between gap-[10px] w-[50%]'>
              <div className='flex flex-col gap-[15px]'>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="rectangular" width={100} height={36} sx={{ bgcolor: 'grey.400' }}/>
              </div>
              <div>
                <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="rectangular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}

export default DetailArticle