import { Link } from 'react-router-dom'
import { useAuth } from '~/contexts/client/AuthContext'

const MyAccountClient = () => {
  const { accountUser } = useAuth()

  return (
    <>
      {accountUser && (
        <div className='w-[70%] flex justify-around gap-[15px] border rounded-[15px] p-[10px] text-[16px]'>
          <div className='flex flex-col gap-[15px]'>
            <div>
              <h1 className='text-[25px] font-[600]'>Hồ sơ của tôi</h1>
              <p className='text-[20px] font-[500]'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>
            <div className='flex flex-col gap-[10px]'>
              <div>
                <b>Họ và tên: </b>
                {accountUser.fullName}
              </div>
              <div>
                <b>Email: </b>
                {accountUser.email}
              </div>
              <div>
                <b>Số điện thoại: </b>
                {accountUser.phone}
              </div>
              <div>
                <b>Địa chỉ: </b>
                {accountUser.address}
              </div>
              <Link
                to={'/user/account/info/edit'}
                className='border rounded-[5px] p-[7px] bg-[#525FE1] text-white text-center w-[20%] text-[14px]'
              >
                  Chỉnh sửa
              </Link>
            </div>
          </div>
          <div className='flex flex-col gap-[5px] text-center'>
            <span className='text-[20px] font-[600]'>Ảnh đại diện:</span>
            <img
              className='border rounded-[100%] w-[250px] h-[250px]'
              src={accountUser.avatar}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default MyAccountClient