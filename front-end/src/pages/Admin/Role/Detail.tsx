import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import useDetail from '~/hooks/Admin/role/useDetail'

const DetailRole = () => {
  const {
    roleDetail,
    role,
    id
  } = useDetail()

  return (
    <>
      {role && role.permissions.includes('roles_view') && (
        roleDetail ? (
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[18px]'>
            <div>
              <b>Nhóm quyền: </b>
              <span className='text-[16px]'>
                {roleDetail.title}
              </span>
            </div>
            <div>
              <b>Mã định danh: </b>
              <span className='text-[16px]'>
                {roleDetail.titleId}
              </span>
            </div>
            <div>
              <b>Mô tả ngắn: </b>
              <div className='text-[16px]' dangerouslySetInnerHTML={{ __html: roleDetail.description }} />
            </div>
            <div className='flex items-center justify-start gap-[5px]'>
              <Link
                to={`/admin/roles/edit/${id}`}
                className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
              >
                Chỉnh sửa
              </Link>
              <Link
                to={'/admin/roles'}
                className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[6%] text-center'
              >
                Quay lại
              </Link>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[25px] shadow-md mt-[15px] text-[18px]'>
            <Skeleton variant="text" width={140} height={48} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={120} height={48} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={130} height={48} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={78} height={34} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        )
      )}
    </>
  )
}

export default DetailRole