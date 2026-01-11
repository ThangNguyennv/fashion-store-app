import { Link } from 'react-router-dom'
import { useAuth } from '~/contexts/client/AuthContext'

const MyAccountClient = () => {
  const { accountUser } = useAuth()

  return (
    <>
      {accountUser && (
        <div className='
            mx-auto /* Căn giữa container */
            flex
            w-[95%] sm:w-[90%] lg:w-[70%] /* Mobile rộng 95%, sm 90%, lg về lại 70% */
            flex-col-reverse md:flex-row /* Mobile: Cột đảo ngược (ảnh lên đầu), PC: Hàng ngang */
            justify-between md:justify-around
            items-center md:items-start /* Mobile: căn giữa, PC: căn trái */
            gap-6 md:gap-[15px]
            border rounded-[15px]
            p-4 md:p-[10px]
            text-[16px]
            bg-white shadow-sm /* Thêm chút nền/bóng cho đẹp (tuỳ chọn) */
        '>

          {/* --- Cột Thông Tin --- */}
          <div className='flex flex-col gap-[15px] w-full md:w-auto items-center md:items-start text-center md:text-left'>
            <div>
              <h1 className='text-[22px] md:text-[25px] font-[600]'>Hồ sơ của tôi</h1>
              <p className='text-[16px] md:text-[20px] font-[500] text-gray-600'>
                Quản lý thông tin hồ sơ để bảo mật tài khoản
              </p>
            </div>

            <div className='flex flex-col gap-[10px] w-full'>
              <div>
                <b>Họ và tên: </b> {accountUser.fullName}
              </div>
              <div className='break-all'> {/* Tránh tràn text nếu email quá dài trên mobile */}
                <b>Email: </b> {accountUser.email}
              </div>
              <div>
                <b>Số điện thoại: </b> {accountUser.phone}
              </div>
              <div>
                <b>Địa chỉ: </b> {accountUser.address}
              </div>

              {/* Button: Mobile full width, PC auto width */}
              <Link
                to={'/user/account/info/edit'}
                className='
                    mt-2 md:mt-0
                    border rounded-[5px] p-[7px]
                    bg-[#525FE1] text-white
                    text-center text-[14px]
                    md:w-auto md:min-w-[120px] /* Responsive độ rộng nút */
                    hover:bg-[#414cb3] transition-colors
                '
              >
                Chỉnh sửa
              </Link>
            </div>
          </div>

          {/* --- Cột Ảnh Đại Diện --- */}
          <div className='flex flex-col gap-[5px] items-center text-center'>
            <span className='text-[18px] md:text-[20px] font-[600]'>Ảnh đại diện:</span>
            <img
              className='
                border rounded-[100%] object-cover
                w-[150px] h-[150px] /* Mặc định (Mobile) */
                sm:w-[200px] sm:h-[200px] /* sm: 640px */
                lg:w-[250px] lg:h-[250px] /* lg: 1024px */
              '
              src={accountUser.avatar}
              alt="User Avatar"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default MyAccountClient