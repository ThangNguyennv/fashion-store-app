import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import useDetail from '~/hooks/Admin/account/useDetail'

const DetailAccount = () => {
  const {
    accountInfo,
    role
  } = useDetail()

  return (
    <>
      {role && role.permissions.includes('accounts_view') && (
        accountInfo ? (
          <>
            <div className='text-[17px] mt-[15px] flex flex-col gap-[15px] w-full bg-[#FFFFFF] py-[15px] pl-[50px] shadow-md'>
              <div className='text-[24px] font-[700] mt-[10px]'>Chi tiết tài khoản</div>
              <img
                src={accountInfo.avatar}
                className='border rounded-[50%] w-[200px] h-[200px]'
              />
              <div>
                <b>Họ và tên: </b>
                {accountInfo.fullName}
              </div>
              <b>Vai trò: {accountInfo.role_id.title}</b>
              <div>
                <b>Email: </b>
                {accountInfo.email}
              </div>
              <div>
                <b>Số điện thoại: </b>
                {accountInfo.phone}
              </div>
              <div>
                <b>Trạng thái: </b>
                {accountInfo.status === 'ACTIVE' ? 'Hoạt động' : 'Dừng hoạt động'}
              </div>

              <div className="flex gap-3 mt-4">
                <Link
                  to={`/admin/accounts/edit/${accountInfo._id}`}
                  className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[6%] text-center text-[14px]'
                >
                Chỉnh sửa
                </Link>
                <Link
                  to={'/admin/accounts'}
                  className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[6%] text-center text-[14px]'
                >
                Quay lại
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className='text-[17px] mt-[15px] flex flex-col gap-[15px] w-full bg-[#FFFFFF] py-[15px] pl-[50px] shadow-md'>
            <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="circular" width={200} height={200} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={140} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={90} height={33} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        )
      )}
    </>
  )
}

export default DetailAccount