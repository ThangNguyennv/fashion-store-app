import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { useMyAccount } from '~/hooks/Admin/MyAccount/useMyAccount'

const MyAccountAdmin = () => {
  const {
    accountInfo,
    role
  } = useMyAccount()

  return (
    <>
      {accountInfo ? (
        <>
          <div className="text-[16px] mt-[15px] flex flex-col gap-[15px] w-[50%] bg-[#FFFFFF] py-[15px] pl-[50px] shadow-md">
            <h1 className="text-[24px] font-[700] mt-[10px]">Thông tin tài khoản của tôi</h1>
            <img
              src={accountInfo.avatar}
              alt="Avatar"
              className="border rounded-[50%] w-[150px] h-[150px]"
            />
            <span>
              <b>Họ và tên: </b>
              {accountInfo.fullName}
            </span>
            <span>
              <b>Email: </b>
              {accountInfo.email}
            </span>
            <span>
              <b>Số điện thoại: </b>
              {accountInfo.phone}
            </span>
            {role && (
              <span>
                <b>Vai trò: </b>
                <span className="text-[#BC3433] font-[600]">{role.title}</span>
              </span>
            )}
            <span>
              <b>Trạng thái: </b>
              {
                accountInfo.status === 'ACTIVE' ?
                  <span className="text-green-500 font-[600]">Hoạt động</span> :
                  <span className="text-red-500 font-[600]"> Dừng hoạt động</span>
              }
            </span>
            <Link
              to={'/admin/my-account/edit'}
              className='nav-link text-[14px] border rounded-[5px] bg-[#2F57EF] p-[4px] text-white w-[13%] text-center'
            >
                Chỉnh sửa
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="text-[16px] mt-[15px] flex flex-col gap-[15px] w-[50%] bg-[#FFFFFF] py-[15px] pl-[50px] shadow-md">
            <Skeleton variant="text" width={250} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="circular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={175} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={200} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={180} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={175} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={170} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={94} height={31} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        </>
      )}
    </>
  )
}

export default MyAccountAdmin